import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { DB, getConnectionPool, getDatabaseClient } from "../lib/database.ts";

import { corsHeaders } from "../lib/headers.ts";
import { getSupabaseServiceRole } from "../lib/supabase.ts";
import { getNextSequence } from "../shared/get-next-sequence.ts";

const pool = getConnectionPool(1);
const db = getDatabaseClient<DB>(pool);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { id: purchaseOrderId, userId } = await req.json();

  try {
    if (!purchaseOrderId) throw new Error("Payload is missing id");
    if (!userId) throw new Error("Payload is missing userId");

    const client = getSupabaseServiceRole(req.headers.get("Authorization"));

    const [purchaseOrder, purchaseOrderLines] = await Promise.all([
      client
        .from("purchaseOrder")
        .select("*")
        .eq("id", purchaseOrderId)
        .single(),
      client
        .from("purchaseOrderLine")
        .select("*")
        .eq("purchaseOrderId", purchaseOrderId),
    ]);

    if (!purchaseOrder.data) throw new Error("Purchase order not found");
    if (purchaseOrderLines.error)
      throw new Error(purchaseOrderLines.error.message);

    const supplier = await client
      .from("supplier")
      .select("*")
      .eq("id", purchaseOrder.data.supplierId)
      .single();

    const uninvoicedLines = purchaseOrderLines?.data?.reduce<
      (typeof purchaseOrderLines)["data"]
    >((acc, line) => {
      if (line?.quantityToInvoice && line.quantityToInvoice > 0) {
        acc.push(line);
      }

      return acc;
    }, []);

    const uninvoicedSubtotal = uninvoicedLines?.reduce((acc, line) => {
      if (
        line?.quantityToInvoice &&
        line.unitPrice &&
        line.quantityToInvoice > 0
      ) {
        acc += line.quantityToInvoice * line.unitPrice;
      }

      return acc;
    }, 0);

    let purchaseInvoiceId = "";

    await db.transaction().execute(async (trx) => {
      purchaseInvoiceId = await getNextSequence(trx, "purchaseInvoice");

      const purchaseInvoice = await trx
        .insertInto("purchaseInvoice")
        .values({
          invoiceId: purchaseInvoiceId,
          status: "Draft",
          supplierId: supplier.data?.id,
          supplierReference: purchaseOrder.data?.supplierReference,
          supplierContactId: purchaseOrder.data?.supplierContactId,
          currencyCode: "USD",
          exchangeRate: 1,
          subtotal: uninvoicedSubtotal,
          totalDiscount: 0,
          totalAmount: uninvoicedSubtotal,
          totalTax: 0,
          balance: uninvoicedSubtotal,
          createdBy: userId,
        })
        .returning(["id"])
        .executeTakeFirstOrThrow();

      if (!purchaseInvoice.id) throw new Error("Purchase invoice not created");
      purchaseInvoiceId = purchaseInvoice.id;

      await trx
        .updateTable("purchaseOrder")
        .set({
          status:
            purchaseOrder.data?.status === "To Receive and Invoice"
              ? "To Receive"
              : "Completed",
        })
        .where("id", "=", purchaseOrderId)
        .execute();
    });

    return new Response(
      JSON.stringify({
        id: purchaseInvoiceId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
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
