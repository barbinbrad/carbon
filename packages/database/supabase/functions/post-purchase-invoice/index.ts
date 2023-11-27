import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { format } from "https://deno.land/std@0.205.0/datetime/mod.ts";
import type { Database } from "../../../src/types.ts";
import { DB, getConnectionPool, getDatabaseClient } from "../lib/database.ts";
import { corsHeaders } from "../lib/headers.ts";
import { getSupabaseServiceRole } from "../lib/supabase.ts";
import { credit, debit } from "../lib/utils.ts";
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

  const { invoiceId } = await req.json();
  const today = format(new Date(), "yyyy-MM-dd");

  try {
    if (!invoiceId) throw new Error("Payload is missing invoiceId");

    const client = getSupabaseServiceRole(req.headers.get("Authorization"));

    const [purchaseInvoice, purchaseInvoiceLines] = await Promise.all([
      client.from("purchaseInvoice").select("*").eq("id", invoiceId).single(),
      client.from("purchaseInvoiceLine").select("*").eq("invoiceId", invoiceId),
    ]);

    if (purchaseInvoice.error)
      throw new Error("Failed to fetch purchaseInvoice");
    if (purchaseInvoiceLines.error)
      throw new Error("Failed to fetch receipt lines");

    const [partGroups, purchaseOrderLines, supplier] = await Promise.all([
      client
        .from("part")
        .select("id, partGroupId")
        .in(
          "id",
          purchaseInvoiceLines.data.reduce<string[]>((acc, invoiceLine) => {
            if (invoiceLine.partId && !acc.includes(invoiceLine.partId)) {
              acc.push(invoiceLine.partId);
            }
            return acc;
          }, [])
        ),
      client
        .from("purchaseOrderLine")
        .select("*")
        .in(
          "id",
          purchaseInvoiceLines.data.reduce<string[]>((acc, invoiceLine) => {
            if (
              invoiceLine.purchaseOrderLineId &&
              !acc.includes(invoiceLine.purchaseOrderLineId)
            ) {
              acc.push(invoiceLine.purchaseOrderLineId);
            }
            return acc;
          }, [])
        ),
      client
        .from("supplier")
        .select("*")
        .eq("id", purchaseInvoice.data.supplierId ?? "")
        .single(),
    ]);
    if (partGroups.error) throw new Error("Failed to fetch part groups");
    if (purchaseOrderLines.error)
      throw new Error("Failed to fetch purchase order lines");
    if (supplier.error) throw new Error("Failed to fetch supplier");

    const purchaseOrders = await client
      .from("purchaseOrder")
      .select("*")
      .in(
        "purchaseOrderId",
        purchaseOrderLines.data.reduce<string[]>((acc, purchaseOrderLine) => {
          if (
            purchaseOrderLine.purchaseOrderId &&
            !acc.includes(purchaseOrderLine.purchaseOrderId)
          ) {
            acc.push(purchaseOrderLine.purchaseOrderId);
          }
          return acc;
        }, [])
      );
    if (purchaseOrders.error)
      throw new Error("Failed to fetch purchase orders");

    const valueLedgerInserts: Database["public"]["Tables"]["valueLedger"]["Insert"][] =
      [];

    const journalLineInserts: Omit<
      Database["public"]["Tables"]["journalLine"]["Insert"],
      "journalId"
    >[] = [];

    const purchaseInvoiceLinesByPurchaseOrderLine =
      purchaseInvoiceLines.data.reduce<
        Record<
          string,
          Database["public"]["Tables"]["purchaseInvoiceLine"]["Row"]
        >
      >((acc, invoiceLine) => {
        if (invoiceLine.purchaseOrderLineId) {
          acc[invoiceLine.purchaseOrderLineId] = invoiceLine;
        }
        return acc;
      }, {});

    const purchaseOrderLineUpdates = purchaseOrderLines.data.reduce<
      Record<
        string,
        Database["public"]["Tables"]["purchaseOrderLine"]["Update"]
      >
    >((acc, purchaseOrderLine) => {
      const invoiceLine =
        purchaseInvoiceLinesByPurchaseOrderLine[purchaseOrderLine.id];
      if (
        invoiceLine &&
        invoiceLine.quantity &&
        purchaseOrderLine.purchaseQuantity &&
        purchaseOrderLine.purchaseQuantity > 0
      ) {
        const newQuantityInvoiced =
          (purchaseOrderLine.quantityInvoiced ?? 0) + invoiceLine.quantity;

        const invoicedComplete =
          purchaseOrderLine.invoicedComplete ||
          invoiceLine.quantity >=
            (purchaseOrderLine.quantityToInvoice ??
              purchaseOrderLine.purchaseQuantity);

        return {
          ...acc,
          [purchaseOrderLine.id]: {
            quantityInvoiced: newQuantityInvoiced,
            invoicedComplete,
            purchaseOrderId: purchaseOrderLine.purchaseOrderId,
          },
        };
      }

      return acc;
    }, {});

    const journalEntriesToReverse = await client
      .from("ledgers")
      .select("*")
      .in(
        "reference",
        purchaseOrderLines.data.reduce<string[]>((acc, purchaseOrderLine) => {
          if (
            (purchaseOrderLine.quantityReceived ?? 0) >
            (purchaseOrderLine.quantityInvoiced ?? 0)
          ) {
            acc.push(`receipt:${purchaseOrderLine.id}`);
          }
          return acc;
        }, [])
      );
    if (journalEntriesToReverse.error) {
      throw new Error("Failed to fetch journal entries to reverse");
    }

    const journalEntriesToReverseByPurchaseOrderLine =
      journalEntriesToReverse.data.reduce<
        Record<string, Database["public"]["Views"]["ledgers"]["Row"][]>
      >((acc, journalEntry) => {
        const [type, purchaseOrderLineId] = (
          journalEntry.reference ?? ""
        ).split(":");
        if (type === "receipt") {
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

    for await (const invoiceLine of purchaseInvoiceLines.data) {
      const reversingEntries = invoiceLine.purchaseOrderLineId
        ? journalEntriesToReverseByPurchaseOrderLine[
            invoiceLine.purchaseOrderLineId
          ] ?? []
        : [];

      const reversingEntryPairs = reversingEntries.reduce<
        Database["public"]["Views"]["ledgers"]["Row"][][]
      >((acc, entry, i) => {
        if (i % 2 === 0) {
          acc.push([entry, reversingEntries[i + 1]]);
        }
        return acc;
      }, []);

      const purchaseOrderLine = purchaseOrderLines.data.find(
        (line) => line.id === invoiceLine.purchaseOrderLineId
      );

      const quantityToReverse = Math.max(
        0,
        Math.min(
          invoiceLine.quantity ?? 0,
          (purchaseOrderLine?.quantityReceived ?? 0) -
            (purchaseOrderLine?.quantityInvoiced ?? 0)
        )
      );
      const quantityAlreadyReversed = Math.max(
        0,
        (purchaseOrderLine?.quantityInvoiced ?? 0) -
          (purchaseOrderLine?.quantityReceived ?? 0)
      );

      let expectedUnitCost = 0;

      if (quantityToReverse > 0) {
        const expectedUnitCostOfReversingEntries = reversingEntryPairs.reduce(
          (acc, entry) => {
            if (entry[0].costAmountExpected && entry[0].quantity) {
              const unitCostForEntry =
                entry[0].costAmountExpected / entry[0].quantity;

              // we don't want to reverse an entry twice, so we need to keep track of what's been previously reversed
              // akin to supply
              const quantityAvailableToReverseForEntry =
                acc.counted > quantityAlreadyReversed
                  ? entry[0].quantity + acc.counted - quantityAlreadyReversed
                  : entry[0].quantity;

              // akin to demand
              const quantityRequiredToReverse =
                quantityToReverse - acc.reversed;

              // we can't reverse more than what's available or what's required
              const quantityToReverseForEntry = Math.min(
                quantityAvailableToReverseForEntry,
                quantityRequiredToReverse
              );

              if (quantityToReverseForEntry > 0) {
                // create the reversal entries
                journalLineInserts.push({
                  accountNumber: entry[0].accountNumber!,
                  description: entry[0].description,
                  amount:
                    entry[0].description === "Interim Inventory Accrual"
                      ? credit(
                          "asset",
                          quantityToReverseForEntry * unitCostForEntry
                        )
                      : debit(
                          "liability",
                          quantityToReverseForEntry * unitCostForEntry
                        ),
                  quantity: quantityToReverseForEntry,
                  documentType: "Invoice",
                  documentId: purchaseInvoice.data?.invoiceId,
                  externalDocumentId: purchaseInvoice?.data.supplierReference,
                  reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
                });
                journalLineInserts.push({
                  accountNumber: entry[1].accountNumber!,
                  description: entry[1].description,
                  amount:
                    entry[1].description === "Interim Inventory Accrual"
                      ? credit(
                          "asset",
                          quantityToReverseForEntry * unitCostForEntry
                        )
                      : debit(
                          "liability",
                          quantityToReverseForEntry * unitCostForEntry
                        ),
                  quantity: quantityToReverseForEntry,
                  documentType: "Invoice",
                  documentId: purchaseInvoice.data?.invoiceId,
                  externalDocumentId: purchaseInvoice?.data.supplierReference,
                  reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
                });
              }

              acc.counted += entry[0].quantity;
              acc.reversed += quantityToReverseForEntry;

              // this gives us a weighted average of the unit costs for each entry we're reversing
              acc.value +=
                (quantityToReverseForEntry * unitCostForEntry) /
                quantityToReverseForEntry;
            }

            return acc;
          },
          {
            counted: 0,
            reversed: 0,
            value: 0,
          }
        );

        expectedUnitCost = expectedUnitCostOfReversingEntries.value;

        valueLedgerInserts.push({
          partLedgerType: "Purchase",
          costLedgerType: "Direct Cost",
          adjustment: false,
          documentType: "Purchase Invoice",
          documentId: purchaseInvoice.data?.invoiceId ?? undefined,
          externalDocumentId:
            purchaseInvoice.data?.supplierReference ?? undefined,
          costAmountActual: invoiceLine.quantity * invoiceLine.unitPrice,
          costAmountExpected: invoiceLine.quantity * -expectedUnitCost,
          actualCostPostedToGl: invoiceLine.quantity * invoiceLine.unitPrice,
          expectedCostPostedToGl: invoiceLine.quantity * -expectedUnitCost,
        });
      } else {
        valueLedgerInserts.push({
          partLedgerType: "Purchase",
          costLedgerType: "Direct Cost",
          adjustment: false,
          documentType: "Purchase Invoice",
          documentId: purchaseInvoice.data?.invoiceId ?? undefined,
          externalDocumentId:
            purchaseInvoice.data?.supplierReference ?? undefined,
          costAmountActual: invoiceLine.quantity * invoiceLine.unitPrice,
          costAmountExpected: 0,
          actualCostPostedToGl: invoiceLine.quantity * invoiceLine.unitPrice,
          expectedCostPostedToGl: 0,
        });
      }

      // posting groups
      const inventoryPostingGroups: Record<
        string,
        Database["public"]["Tables"]["postingGroupInventory"]["Row"] | null
      > = {};

      let postingGroupInventory:
        | Database["public"]["Tables"]["postingGroupInventory"]["Row"]
        | null = null;

      const partGroupId: string | null =
        partGroups.data.find((partGroup) => partGroup.id === invoiceLine.partId)
          ?.partGroupId ?? null;
      const locationId = invoiceLine.locationId ?? null;
      const supplierTypeId: string | null =
        supplier.data.supplierTypeId ?? null;

      // inventory posting group
      if (`${partGroupId}-${locationId}` in inventoryPostingGroups) {
        postingGroupInventory =
          inventoryPostingGroups[`${partGroupId}-${locationId}`];
      } else {
        const inventoryPostingGroup = await getInventoryPostingGroup(client, {
          partGroupId,
          locationId,
        });

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
        const purchasingPostingGroup = await getPurchasingPostingGroup(client, {
          partGroupId,
          supplierTypeId,
        });

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

      // debit the inventory account
      journalLineInserts.push({
        accountNumber: postingGroupInventory.inventoryAccount,
        description: "Inventory Account",
        amount: debit("asset", invoiceLine.quantity * invoiceLine.unitPrice),
        quantity: invoiceLine.quantity,
        documentType: "Invoice",
        documentId: purchaseInvoice.data?.invoiceId,
        externalDocumentId: purchaseInvoice.data?.supplierReference,
        reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
      });

      // creidt the direct cost applied account
      journalLineInserts.push({
        accountNumber: postingGroupInventory.directCostAppliedAccount,
        description: "Direct Cost Applied",
        amount: credit("expense", invoiceLine.quantity * invoiceLine.unitPrice),
        quantity: invoiceLine.quantity,
        documentType: "Invoice",
        documentId: purchaseInvoice.data?.invoiceId,
        externalDocumentId: purchaseInvoice.data?.supplierReference,
        reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
      });

      // debit the purchase account
      journalLineInserts.push({
        accountNumber: postingGroupPurchasing.purchaseAccount,
        description: "Purchase Account",
        amount: debit("expense", invoiceLine.quantity * invoiceLine.unitPrice),
        quantity: invoiceLine.quantity,
        documentType: "Invoice",
        documentId: purchaseInvoice.data?.invoiceId,
        externalDocumentId: purchaseInvoice.data?.supplierReference,
        reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
      });

      // credit the accounts payable account
      journalLineInserts.push({
        accountNumber: postingGroupPurchasing.payablesAccount,
        description: "Accounts Payable",
        amount: credit(
          "liability",
          invoiceLine.quantity * invoiceLine.unitPrice
        ),
        quantity: invoiceLine.quantity,
        documentType: "Invoice",
        documentId: purchaseInvoice.data?.invoiceId,
        externalDocumentId: purchaseInvoice.data?.supplierReference,
        reference: `purchase-invoice:${invoiceLine.purchaseOrderLineId}`,
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

      const purchaseOrdersUpdated = Object.values(
        purchaseOrderLineUpdates
      ).reduce<string[]>((acc, update) => {
        if (update.purchaseOrderId && !acc.includes(update.purchaseOrderId)) {
          acc.push(update.purchaseOrderId);
        }
        return acc;
      }, []);

      console.log({ purchaseOrdersUpdated, purchaseOrderLineUpdates });

      for await (const purchaseOrderId of purchaseOrdersUpdated) {
        const purchaseOrderLines = await trx
          .selectFrom("purchaseOrderLine")
          .select(["id", "invoicedComplete", "receivedComplete"])
          .where("purchaseOrderId", "=", purchaseOrderId)
          .execute();

        const areAllLinesInvoiced = purchaseOrderLines.every(
          (line) => line.invoicedComplete
        );

        const areAllLinesReceived = purchaseOrderLines.every(
          (line) => line.receivedComplete
        );

        let status: Database["public"]["Tables"]["purchaseOrder"]["Row"]["status"] =
          "To Receive and Invoice";
        console.log({
          areAllLinesInvoiced,
          areAllLinesReceived,
          purchaseOrderLines,
        });
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
          .where("id", "=", purchaseOrderId)
          .execute();
      }

      const journal = await trx
        .insertInto("journal")
        .values({
          accountingPeriodId,
          description: `Purchase Invoice ${purchaseInvoice.data?.invoiceId}`,
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

      const valueLedgerIds = await trx
        .insertInto("valueLedger")
        .values(valueLedgerInserts)
        .returning(["id"])
        .execute();

      const journalLinesPerValueEntry =
        journalLineIds.length / valueLedgerIds.length;

      for (let i = 0; i < valueLedgerIds.length; i++) {
        const valueLedgerId = valueLedgerIds[i].id;
        for (let j = 0; j < journalLinesPerValueEntry; j++) {
          const journalLineId =
            journalLineIds[i * journalLinesPerValueEntry + j].id;
          if (!journalLineId) {
            throw new Error("Failed to insert journal line entries");
          }

          if (!valueLedgerId) {
            throw new Error("Failed to insert value ledger entries");
          }

          await trx
            .insertInto("valueLedgerJournalLineRelation")
            .values({
              valueLedgerId,
              journalLineId,
            })
            .execute();
        }
      }

      await trx
        .updateTable("purchaseInvoice")
        .set({
          postingDate: today,
          status: "Submitted",
        })
        .where("id", "=", invoiceId)
        .execute();
    });

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
    if (invoiceId) {
      const client = getSupabaseServiceRole(req.headers.get("Authorization"));
      client
        .from("purchaseInvoice")
        .update({ status: "Draft" })
        .eq("id", invoiceId);
    }
    return new Response(JSON.stringify(err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
