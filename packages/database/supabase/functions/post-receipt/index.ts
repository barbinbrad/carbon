import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { format } from "https://deno.land/std@0.205.0/datetime/mod.ts";
import type { Database } from "../../../src/types.ts";
import { DB, getConnectionPool, getDatabaseClient } from "../lib/database.ts";
import { corsHeaders } from "../lib/headers.ts";
import { getSupabaseServiceRole } from "../lib/supabase.ts";
import { credit, debit, journalReference } from "../lib/utils.ts";
import { getCurrentAccountingPeriod } from "../shared/get-accounting-period.ts";
import {
  getInventoryPostingGroup,
  getPurchasingPostingGroup,
} from "../shared/get-posting-group.ts";

const pool = getConnectionPool(1);
const db = getDatabaseClient<DB>(pool);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { receiptId } = await req.json();
  const today = format(new Date(), "yyyy-MM-dd");

  try {
    if (!receiptId) throw new Error("Payload is missing receiptId");

    const client = getSupabaseServiceRole(req.headers.get("Authorization"));

    const [receipt, receiptLines] = await Promise.all([
      client.from("receipt").select("*").eq("id", receiptId).single(),
      client.from("receiptLine").select("*").eq("receiptId", receiptId),
    ]);

    if (receipt.error) throw new Error("Failed to fetch receipt");
    if (receiptLines.error) throw new Error("Failed to fetch receipt lines");

    const partGroups = await client
      .from("part")
      .select("id, partGroupId")
      .in(
        "id",
        receiptLines.data.reduce<string[]>((acc, receiptLine) => {
          if (receiptLine.partId && !acc.includes(receiptLine.partId)) {
            acc.push(receiptLine.partId);
          }
          return acc;
        }, [])
      );
    if (partGroups.error) throw new Error("Failed to fetch part groups");

    switch (receipt.data?.sourceDocument) {
      case "Purchase Order": {
        if (!receipt.data.sourceDocumentId)
          throw new Error("Receipt has no sourceDocumentId");

        const [purchaseOrder, purchaseOrderLines] = await Promise.all([
          client
            .from("purchaseOrder")
            .select("*")
            .eq("id", receipt.data.sourceDocumentId)
            .single(),
          client
            .from("purchaseOrderLine")
            .select("*")
            .eq("purchaseOrderId", receipt.data.sourceDocumentId),
        ]);
        if (purchaseOrder.error)
          throw new Error("Failed to fetch purchase order");
        if (purchaseOrderLines.error)
          throw new Error("Failed to fetch purchase order lines");

        const supplier = await client
          .from("supplier")
          .select("*")
          .eq("id", purchaseOrder.data.supplierId)
          .single();
        if (supplier.error) throw new Error("Failed to fetch supplier");

        const costLedgerInserts: Database["public"]["Tables"]["costLedger"]["Insert"][] =
          [];
        const partLedgerInserts: Database["public"]["Tables"]["partLedger"]["Insert"][] =
          [];
        const journalLineInserts: Omit<
          Database["public"]["Tables"]["journalLine"]["Insert"],
          "journalId"
        >[] = [];

        const receiptLinesByPurchaseOrderLineId = receiptLines.data.reduce<
          Record<string, Database["public"]["Tables"]["receiptLine"]["Row"]>
        >((acc, receiptLine) => {
          if (receiptLine.lineId) {
            acc[receiptLine.lineId] = receiptLine;
          }
          return acc;
        }, {});

        const purchaseOrderLineUpdates = purchaseOrderLines.data.reduce<
          Record<
            string,
            Database["public"]["Tables"]["purchaseOrderLine"]["Update"]
          >
        >((acc, purchaseOrderLine) => {
          const receiptLine =
            receiptLinesByPurchaseOrderLineId[purchaseOrderLine.id];
          if (
            receiptLine &&
            receiptLine.receivedQuantity &&
            purchaseOrderLine.purchaseQuantity &&
            purchaseOrderLine.purchaseQuantity > 0
          ) {
            const newQuantityReceived =
              (purchaseOrderLine.quantityReceived ?? 0) +
              receiptLine.receivedQuantity;

            const receivedComplete =
              purchaseOrderLine.receivedComplete ||
              receiptLine.receivedQuantity >=
                (purchaseOrderLine.quantityToReceive ??
                  purchaseOrderLine.purchaseQuantity);

            return {
              ...acc,
              [purchaseOrderLine.id]: {
                quantityReceived: newQuantityReceived,
                receivedComplete,
              },
            };
          }

          return acc;
        }, {});

        const journalLines = await client
          .from("journalLine")
          .select("*")
          .in(
            "reference",
            purchaseOrderLines.data.reduce<string[]>(
              (acc, purchaseOrderLine) => {
                if (
                  (purchaseOrderLine.quantityReceived ?? 0) <
                  (purchaseOrderLine.quantityInvoiced ?? 0)
                ) {
                  acc.push(
                    journalReference.to.purchaseInvoice(purchaseOrderLine.id)
                  );
                }
                return acc;
              },
              []
            )
          );
        if (journalLines.error) {
          throw new Error("Failed to fetch journal entries to reverse");
        }

        const journalLinesByPurchaseOrderLine = journalLines.data.reduce<
          Record<string, Database["public"]["Tables"]["journalLine"]["Row"][]>
        >((acc, journalEntry) => {
          const [type, purchaseOrderLineId] = (
            journalEntry.reference ?? ""
          ).split(":");
          if (type === "purchase-invoice") {
            if (
              acc[purchaseOrderLineId] &&
              Array.isArray(acc[purchaseOrderLineId])
            ) {
              acc[purchaseOrderLineId].push(journalEntry);
            } else {
              acc[purchaseOrderLineId] = [journalEntry];
            }
          }
          return acc;
        }, {});

        // save the posting groups in memory to avoid unnecessary queries
        const inventoryPostingGroups: Record<
          string,
          Database["public"]["Tables"]["postingGroupInventory"]["Row"] | null
        > = {};

        for await (const receiptLine of receiptLines.data) {
          let postingGroupInventory:
            | Database["public"]["Tables"]["postingGroupInventory"]["Row"]
            | null = null;

          const partGroupId: string | null =
            partGroups.data.find(
              (partGroup) => partGroup.id === receiptLine.partId
            )?.partGroupId ?? null;
          const locationId = receiptLine.locationId ?? null;
          const supplierTypeId: string | null =
            supplier.data.supplierTypeId ?? null;

          // inventory posting group
          if (`${partGroupId}-${locationId}` in inventoryPostingGroups) {
            postingGroupInventory =
              inventoryPostingGroups[`${partGroupId}-${locationId}`];
          } else {
            const inventoryPostingGroup = await getInventoryPostingGroup(
              client,
              {
                partGroupId,
                locationId,
              }
            );

            if (inventoryPostingGroup.error || !inventoryPostingGroup.data) {
              throw new Error("Error getting inventory posting group");
            }

            postingGroupInventory = inventoryPostingGroup.data ?? null;
            inventoryPostingGroups[`${partGroupId}-${locationId}`] =
              postingGroupInventory;
          }

          if (!postingGroupInventory) {
            throw new Error("No inventory posting group found");
          }

          // purchasing posting group
          const purchasingPostingGroups: Record<
            string,
            Database["public"]["Tables"]["postingGroupPurchasing"]["Row"] | null
          > = {};

          let postingGroupPurchasing:
            | Database["public"]["Tables"]["postingGroupPurchasing"]["Row"]
            | null = null;

          if (`${partGroupId}-${supplierTypeId}` in purchasingPostingGroups) {
            postingGroupPurchasing =
              purchasingPostingGroups[`${partGroupId}-${supplierTypeId}`];
          } else {
            const purchasingPostingGroup = await getPurchasingPostingGroup(
              client,
              {
                partGroupId,
                supplierTypeId,
              }
            );

            if (purchasingPostingGroup.error || !purchasingPostingGroup.data) {
              throw new Error("Error getting purchasing posting group");
            }

            postingGroupPurchasing = purchasingPostingGroup.data ?? null;
            purchasingPostingGroups[`${partGroupId}-${supplierTypeId}`] =
              postingGroupPurchasing;
          }

          if (!postingGroupPurchasing) {
            throw new Error("No purchasing posting group found");
          }

          // determine the journal lines that should be reversed
          const existingJournalLines = receiptLine.lineId
            ? journalLinesByPurchaseOrderLine[receiptLine.lineId] ?? []
            : [];

          let previousJournalId: number | null = null;
          let previousAccrual: boolean | null = null;
          let currentGroup = 0;

          const existingJournalLineGroups = existingJournalLines.reduce<
            Database["public"]["Tables"]["journalLine"]["Row"][][]
          >((acc, entry) => {
            const { journalId, accrual } = entry;

            if (
              journalId === previousJournalId &&
              accrual === previousAccrual
            ) {
              acc[currentGroup - 1].push(entry);
            } else {
              acc.push([entry]);
              currentGroup++;
            }

            previousJournalId = journalId;
            previousAccrual = accrual;
            return acc;
          }, []);

          const purchaseOrderLine = purchaseOrderLines.data.find(
            (line) => line.id === receiptLine.lineId
          );

          const quantityReceived = purchaseOrderLine?.quantityReceived ?? 0;
          const quantityInvoiced = purchaseOrderLine?.quantityInvoiced ?? 0;

          const quantityToReverse = Math.max(
            0,
            Math.min(
              receiptLine.receivedQuantity ?? 0,
              quantityInvoiced - quantityReceived
            )
          );

          const quantityAlreadyReversed =
            quantityReceived < quantityInvoiced ? quantityReceived : 0;

          if (quantityToReverse > 0) {
            let counted = 0;
            let reversed = 0;
            let value = 0;

            existingJournalLineGroups.forEach((entry) => {
              if (entry[0].quantity) {
                const unitCostForEntry =
                  (entry[0].amount ?? 0) / entry[0].quantity;

                // we don't want to reverse an entry twice, so we need to keep track of what's been previously reversed

                // akin to supply
                const quantityAvailableToReverseForEntry =
                  quantityAlreadyReversed > counted
                    ? entry[0].quantity + counted - quantityAlreadyReversed
                    : entry[0].quantity;

                // akin to demand
                const quantityRequiredToReverse = quantityToReverse - reversed;

                // we can't reverse more than what's available or what's required
                const quantityToReverseForEntry = Math.max(
                  0,
                  Math.min(
                    quantityAvailableToReverseForEntry,
                    quantityRequiredToReverse
                  )
                );

                if (quantityToReverseForEntry > 0) {
                  if (
                    entry[0].accrual === false ||
                    entry[1].accrual === false
                  ) {
                    throw new Error("Cannot reverse non-accrual entries");
                  }

                  // create the reversal entries
                  journalLineInserts.push({
                    accountNumber: entry[0].accountNumber!,
                    description: entry[0].description,
                    amount:
                      entry[0].description === "Inventory Invoiced Not Received"
                        ? credit(
                            "asset",
                            quantityToReverseForEntry * unitCostForEntry
                          )
                        : debit(
                            "asset", // "Interim Inventory Accrual"
                            quantityToReverseForEntry * unitCostForEntry
                          ),
                    quantity: quantityToReverseForEntry,
                    documentType: "Invoice",
                    documentId: receipt.data?.id,
                    externalDocumentId: receipt?.data.externalDocumentId,
                    reference: journalReference.to.receipt(receiptLine.lineId!),
                  });
                  journalLineInserts.push({
                    accountNumber: entry[1].accountNumber!,
                    description: entry[1].description,
                    amount:
                      entry[1].description === "Inventory Invoiced Not Received"
                        ? credit(
                            "asset",
                            quantityToReverseForEntry * unitCostForEntry
                          )
                        : debit(
                            "asset", // "Interim Inventory Accrual"
                            quantityToReverseForEntry * unitCostForEntry
                          ),
                    quantity: quantityToReverseForEntry,
                    documentType: "Invoice",
                    documentId: receipt.data?.id,
                    externalDocumentId: receipt?.data.externalDocumentId,
                    reference: journalReference.to.receipt(receiptLine.lineId!),
                  });
                }

                counted += entry[0].quantity;
                reversed += quantityToReverseForEntry;
                value += unitCostForEntry * quantityToReverseForEntry;
              }
            });

            // create the cost ledger entry
            costLedgerInserts.push({
              partLedgerType: "Purchase",
              costLedgerType: "Direct Cost",
              adjustment: false,
              documentType: "Purchase Receipt",
              documentId: receipt.data?.id ?? undefined,
              externalDocumentId: receipt.data?.externalDocumentId ?? undefined,
              partId: receiptLine.partId,
              quantity: quantityToReverse,
              cost: value,
              costPostedToGL: value,
            });

            // create the normal GL entries

            // debit the inventory account
            journalLineInserts.push({
              accountNumber: postingGroupInventory.inventoryAccount,
              description: "Inventory Account",
              amount: debit("asset", value),
              quantity: quantityToReverse,
              documentType: "Receipt",
              documentId: receipt.data?.id,
              externalDocumentId: receipt.data?.externalDocumentId,
              reference: journalReference.to.receipt(receiptLine.lineId!),
            });

            // creidt the direct cost applied account
            journalLineInserts.push({
              accountNumber: postingGroupInventory.directCostAppliedAccount,
              description: "Direct Cost Applied",
              amount: credit("expense", value),
              quantity: quantityToReverse,
              documentType: "Receipt",
              documentId: receipt.data?.id,
              externalDocumentId: receipt.data?.externalDocumentId,
              reference: journalReference.to.receipt(receiptLine.lineId!),
            });

            // debit the purchase account
            journalLineInserts.push({
              accountNumber: postingGroupPurchasing.purchaseAccount,
              description: "Purchase Account",
              amount: debit("expense", value),
              quantity: quantityToReverse,
              documentType: "Receipt",
              documentId: receipt.data?.id,
              externalDocumentId: receipt.data?.externalDocumentId,
              reference: journalReference.to.receipt(receiptLine.lineId!),
            });

            // credit the accounts payable account
            journalLineInserts.push({
              accountNumber: postingGroupPurchasing.payablesAccount,
              description: "Accounts Payable",
              amount: credit("liability", value),
              quantity: quantityToReverse,
              documentType: "Receipt",
              documentId: receipt.data?.id,
              externalDocumentId: receipt.data?.externalDocumentId,
              reference: journalReference.to.receipt(receiptLine.lineId!),
            });
          }

          if (receiptLine.receivedQuantity > quantityToReverse) {
            // create the accrual entries for received not invoiced
            const quantityToAccrue =
              receiptLine.receivedQuantity - quantityToReverse;

            const expectedValue =
              (receiptLine.receivedQuantity - quantityToReverse) *
              receiptLine.unitPrice;

            journalLineInserts.push({
              accountNumber:
                postingGroupInventory.inventoryInterimAccrualAccount,
              description: "Interim Inventory Accrual",
              accrual: true,
              amount: debit("asset", expectedValue),
              quantity: quantityToAccrue,
              documentType: "Receipt",
              documentId: receipt.data?.id ?? undefined,
              externalDocumentId:
                purchaseOrder.data?.supplierReference ?? undefined,
              reference: `receipt:${receiptLine.lineId}`,
            });

            journalLineInserts.push({
              accountNumber:
                postingGroupInventory.inventoryReceivedNotInvoicedAccount,
              description: "Inventory Received Not Invoiced",
              accrual: true,
              amount: credit("liability", expectedValue),
              quantity: quantityToAccrue,
              documentType: "Receipt",
              documentId: receipt.data?.id ?? undefined,
              externalDocumentId:
                purchaseOrder.data?.supplierReference ?? undefined,
              reference: `receipt:${receiptLine.lineId}`,
            });
          }

          partLedgerInserts.push({
            postingDate: today,
            partId: receiptLine.partId,
            quantity: receiptLine.receivedQuantity,
            locationId: receiptLine.locationId,
            shelfId: receiptLine.shelfId,
            entryType: "Positive Adjmt.",
            documentType: "Purchase Receipt",
            documentId: receipt.data?.id ?? undefined,
            externalDocumentId: receipt.data?.externalDocumentId ?? undefined,
          });
        }

        const accountingPeriodId = await getCurrentAccountingPeriod(client, db);

        await db.transaction().execute(async (trx) => {
          for await (const [purchaseOrderLineId, update] of Object.entries(
            purchaseOrderLineUpdates
          )) {
            await trx
              .updateTable("purchaseOrderLine")
              .set(update)
              .where("id", "=", purchaseOrderLineId)
              .execute();
          }

          const purchaseOrderLines = await trx
            .selectFrom("purchaseOrderLine")
            .select(["id", "invoicedComplete", "receivedComplete"])
            .where("purchaseOrderId", "=", purchaseOrder.data.id)
            .execute();

          const areAllLinesInvoiced = purchaseOrderLines.every(
            (line) => line.invoicedComplete
          );

          const areAllLinesReceived = purchaseOrderLines.every(
            (line) => line.receivedComplete
          );

          let status: Database["public"]["Tables"]["purchaseOrder"]["Row"]["status"] =
            "To Receive and Invoice";
          if (areAllLinesInvoiced && areAllLinesReceived) {
            status = "Completed";
          } else if (areAllLinesInvoiced) {
            status = "To Receive";
          } else if (areAllLinesReceived) {
            status = "To Invoice";
          }

          await trx
            .updateTable("purchaseOrder")
            .set({
              status,
            })
            .where("id", "=", purchaseOrder.data.id)
            .execute();

          await trx
            .updateTable("purchaseOrderDelivery")
            .set({
              deliveryDate: today,
              locationId: receipt.data.locationId,
            })
            .where("id", "=", receipt.data.sourceDocumentId)
            .execute();

          await trx
            .insertInto("partLedger")
            .values(partLedgerInserts)
            .returning(["id"])
            .execute();

          const journal = await trx
            .insertInto("journal")
            .values({
              accountingPeriodId,
              description: `Purchase Receipt ${receipt.data.receiptId}`,
              postingDate: today,
            })
            .returning(["id"])
            .execute();

          const journalId = journal[0].id;
          if (!journalId) throw new Error("Failed to insert journal");

          const journalLineIds = await trx
            .insertInto("journalLine")
            .values(
              journalLineInserts.map((journalLine) => ({
                ...journalLine,
                journalId,
              }))
            )
            .returning(["id"])
            .execute();

          if (costLedgerInserts.length > 0) {
            const costLedgerIds = await trx
              .insertInto("costLedger")
              .values(costLedgerInserts)
              .returning(["id"])
              .execute();

            // insert relationship between journal entry and value entry
            const journalLinesPerCostEntry =
              journalLineIds.length / costLedgerIds.length;
            const costLedgerJournalLineRelationInserts = journalLineIds.map<
              Database["public"]["Tables"]["costLedgerJournalLineRelation"]["Insert"]
            >((journalLineId, i) => ({
              journalLineId: journalLineId.id!,
              costLedgerId:
                costLedgerIds[Math.floor(i / journalLinesPerCostEntry)].id!,
            }));

            await trx
              .insertInto("costLedgerJournalLineRelation")
              .values(costLedgerJournalLineRelationInserts)
              .execute();
          }

          await trx
            .updateTable("receipt")
            .set({
              status: "Posted",
              postingDate: today,
            })
            .where("id", "=", receiptId)
            .execute();
        });
        break;
      }
      default: {
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    if (receiptId) {
      const client = getSupabaseServiceRole(req.headers.get("Authorization"));
      client.from("receipt").update({ status: "Draft" }).eq("id", receiptId);
    }
    return new Response(JSON.stringify(err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
