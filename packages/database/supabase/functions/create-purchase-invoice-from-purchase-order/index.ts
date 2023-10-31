import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import { DB, getConnectionPool, getDatabaseClient } from "../lib/database.ts";

import { corsHeaders } from "../lib/headers.ts";
import { getSupabaseServiceRole } from "../lib/supabase.ts";
import { interpolateSequenceDate } from "../lib/utils.ts";

const pool = getConnectionPool(1);
const db = getDatabaseClient<DB>(pool);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const { id, userId } = await req.json();

  try {
    if (!id) throw new Error("Payload is missing id");
    if (!userId) throw new Error("Payload is missing userId");

    const client = getSupabaseServiceRole(req.headers.get("Authorization"));

    const [purchaseOrder, purchaseOrderLines] = await Promise.all([
      client.from("purchaseOrder").select("*").eq("id", id).single(),
      client.from("purchaseOrderLine").select("*").eq("purchaseOrderId", id),
    ]);

    if (!purchaseOrder.data) throw new Error("Purchase order not found");
    if (purchaseOrderLines.error)
      throw new Error(purchaseOrderLines.error.message);

    const supplier = await client
      .from("supplier")
      .select("*")
      .eq("id", id)
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
      // get current purchase invoice sequence number
      const sequence = await trx
        .selectFrom("sequence")
        .selectAll()
        .where("table", "=", "purchaseInvoice")
        .executeTakeFirstOrThrow();

      const { prefix, suffix, next, size, step } = sequence;
      if (!prefix || !suffix || !next || !size || !step)
        throw new Error("Sequence not found");

      const nextValue = next + step;
      const nextSequence = nextValue.toString().padStart(size, "0");
      const derivedPrefix = interpolateSequenceDate(prefix);
      const derivedSuffix = interpolateSequenceDate(suffix);

      await trx
        .updateTable("sequence")
        .set({
          next: nextValue,
          updatedBy: "system",
        })
        .where("table", "=", "purchaseInvoice")
        .execute();

      purchaseInvoiceId = `${derivedPrefix}${nextSequence}${derivedSuffix}`;

      await trx
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
        .execute();
    });

    return new Response(
      JSON.stringify({
        id: purchaseInvoiceId,
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
