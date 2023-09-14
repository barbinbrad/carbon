import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

import type { Database } from "../../../src/types.ts";
import { getConnectionPool, getDatabaseClient } from "../lib/database.ts";
import { corsHeaders } from "../lib/headers.ts";
import { getSupabaseServiceRole } from "../lib/supabase.ts";

// Use the supabase types to define a subset of the database we'll transact with
interface DB {
  generalLedger: Database["public"]["Tables"]["generalLedger"]["Insert"];
  purchaseOrderLine: Database["public"]["Tables"]["purchaseOrderLine"]["Update"];
  partLedger: Database["public"]["Tables"]["partLedger"]["Insert"];
  partLedgerValueLedgerRelation: Database["public"]["Tables"]["partLedgerValueLedgerRelation"]["Insert"];
  receipt: Database["public"]["Tables"]["receipt"]["Update"];
  valueLedger: Database["public"]["Tables"]["valueLedger"]["Insert"];
  valueLedgerGeneralLedgerRelation: Database["public"]["Tables"]["valueLedgerGeneralLedgerRelation"]["Insert"];
}

const pool = getConnectionPool(1);
const db = getDatabaseClient<DB>(pool);

serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const { receiptId } = await req.json();
    if (!receiptId) throw new Error("No receiptId provided");

    const client = getSupabaseServiceRole(req.headers.get("Authorization"));

    const receipt = await client
      .from("receipt")
      .select("*")
      .eq("id", receiptId)
      .single();
    if (receipt.error) throw new Error("Failed to fetch receipt");

    const receiptLines = await client
      .from("receiptLine")
      .select("*")
      .eq("receiptId", receipt.data.receiptId);
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
        let purchaseOrderLineUpdates: Record<
          string,
          Database["public"]["Tables"]["purchaseOrderLine"]["Update"]
        > = {};

        const valueLedgerInserts: Database["public"]["Tables"]["valueLedger"]["Insert"][] =
          [];
        const partLedgerInserts: Database["public"]["Tables"]["partLedger"]["Insert"][] =
          [];
        const generalLedgerInserts: Database["public"]["Tables"]["generalLedger"]["Insert"][] =
          [];

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

        const receiptLinesByLineId = receiptLines.data.reduce<
          Record<string, Database["public"]["Tables"]["receiptLine"]["Row"]>
        >((acc, receiptLine) => {
          if (receiptLine.lineId) {
            acc[receiptLine.lineId] = receiptLine;
          }
          return acc;
        }, {});

        purchaseOrderLineUpdates = purchaseOrderLines.data.reduce<
          Record<
            string,
            Database["public"]["Tables"]["purchaseOrderLine"]["Update"]
          >
        >((acc, purchaseOrderLine) => {
          const receiptLine = receiptLinesByLineId[purchaseOrderLine.id];
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

        const cachedInventoryPostingGroups: Record<
          string,
          Database["public"]["Tables"]["postingGroupInventory"]["Row"] | null
        > = {};

        for await (const receiptLine of receiptLines.data) {
          const expectedValue =
            receiptLine.receivedQuantity * receiptLine.unitPrice;

          // value ledger entry
          valueLedgerInserts.push({
            partLedgerType: "Purchase",
            costLedgerType: "Direct Cost",
            adjustment: false,
            documentType: "Purchase Receipt",
            documentId: receipt.data?.receiptId ?? undefined,
            externalDocumentId: receipt.data?.externalDocumentId ?? undefined,
            costAmountActual: 0,
            costAmountExpected: expectedValue,
            actualCostPostedToGl: 0,
            expectedCostPostedToGl: expectedValue,
          });

          // part ledger entry
          partLedgerInserts.push({
            entryType: "Positive Adjmt.",
            documentType: "Purchase Receipt",
            documentId: receipt.data?.receiptId ?? undefined,
            externalDocumentId: receipt.data?.externalDocumentId ?? undefined,
            partId: receiptLine.partId,
            locationId: receiptLine.locationId ?? undefined,
            shelfId: receiptLine.shelfId ?? undefined,
            quantity: receiptLine.receivedQuantity,
          });

          // general ledger entries
          let postingGroup:
            | Database["public"]["Tables"]["postingGroupInventory"]["Row"]
            | null = null;
          const partGroupId: string | null =
            partGroups.data.find(
              (partGroup) => partGroup.id === receiptLine.partId
            )?.partGroupId ?? null;
          const locationId = receiptLine.locationId ?? null;

          if (`${partGroupId}-${locationId}` in cachedInventoryPostingGroups) {
            postingGroup =
              cachedInventoryPostingGroups[`${partGroupId}-${locationId}`];
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

            postingGroup = inventoryPostingGroup.data ?? null;
            cachedInventoryPostingGroups[`${partGroupId}-${locationId}`] =
              postingGroup;
          }

          if (!postingGroup) {
            throw new Error("No inventory posting group found");
          }

          generalLedgerInserts.push({
            accountNumber: postingGroup.inventoryInterimAccrualAccount,
            description: "Interim Inventory Accrual",
            amount: -expectedValue,
            documentType: "Order",
            documentId: receipt.data?.sourceDocumentReadableId ?? undefined,
            externalDocumentId:
              purchaseOrder.data?.supplierReference ?? undefined,
          });
          generalLedgerInserts.push({
            accountNumber: postingGroup.inventoryReceivedNotInvoicedAccount,
            description: "Inventory Received Not Invoiced",
            amount: expectedValue,
            documentType: "Order",
            documentId: receipt.data?.sourceDocumentReadableId ?? undefined,
            externalDocumentId:
              purchaseOrder.data?.supplierReference ?? undefined,
          });
        }

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

          const partLedgerIds = await trx
            .insertInto("partLedger")
            .values(partLedgerInserts)
            .returning(["id"])
            .execute();

          const generalLedgerIds = await trx
            .insertInto("generalLedger")
            .values(generalLedgerInserts)
            .returning(["id"])
            .execute();

          const valueLedgerIds = await trx
            .insertInto("valueLedger")
            .values(valueLedgerInserts)
            .returning(["id"])
            .execute();

          const glEntriesPerValueEntry =
            generalLedgerIds.length / valueLedgerIds.length;
          if (
            glEntriesPerValueEntry !== 2 ||
            partLedgerIds.length !== valueLedgerIds.length
          ) {
            throw new Error("Failed to insert ledger entries");
          }

          for (let i = 0; i < valueLedgerIds.length; i++) {
            const valueLedgerId = valueLedgerIds[i].id;
            const partLedgerId = partLedgerIds[i].id;

            if (!valueLedgerId || !partLedgerId) {
              throw new Error("Failed to insert ledger entries");
            }

            await trx
              .insertInto("partLedgerValueLedgerRelation")
              .values({
                partLedgerId,
                valueLedgerId,
              })
              .execute();

            for (let j = 0; j < glEntriesPerValueEntry; j++) {
              const generalLedgerId =
                generalLedgerIds[i * glEntriesPerValueEntry + j].id;
              if (!generalLedgerId) {
                throw new Error("Failed to insert ledger entries");
              }

              await trx
                .insertInto("valueLedgerGeneralLedgerRelation")
                .values({
                  valueLedgerId,
                  generalLedgerId,
                })
                .execute();
            }
          }

          await trx
            .updateTable("receipt")
            .set({
              status: "Posted",
              postingDate: format(new Date(), "yyyy-MM-dd"),
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
        data: null,
        error: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function getInventoryPostingGroup(
  client: SupabaseClient<Database>,
  args: {
    partGroupId: string | null;
    locationId: string | null;
  }
) {
  let query = client.from("postingGroupInventory").select("*");

  if (args.partGroupId === null) {
    query = query.is("partGroupId", null);
  } else {
    query = query.eq("partGroupId", args.partGroupId);
  }

  if (args.locationId === null) {
    query = query.is("locationId", null);
  } else {
    query = query.eq("locationId", args.locationId);
  }

  return await query.single();
}
