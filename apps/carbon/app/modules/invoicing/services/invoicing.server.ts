import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { getSupplier } from "~/modules/purchasing";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type { purchaseInvoiceValidator } from "./invoicing.form";

export async function createPurchaseInvoiceFromPurchaseOrder(
  purchaseOrderId: string,
  userId: string
) {
  const client = getSupabaseServiceRole();
  return client.functions.invoke<{ id: string }>(
    "create-purchase-invoice-from-purchase-order",
    {
      body: {
        id: purchaseOrderId,
        userId: userId,
      },
    }
  );
}

export async function createPurchaseInvoiceFromReceipt(
  receiptId: string,
  userId: string
) {
  const client = getSupabaseServiceRole();
  return client.functions.invoke<{ id: string }>(
    "create-purchase-invoice-from-receipt",
    {
      body: {
        id: receiptId,
        userId: userId,
      },
    }
  );
}

export async function deletePurchaseInvoice(
  client: SupabaseClient<Database>,
  purchaseInvoiceId: string
) {
  return client.from("purchaseInvoice").delete().eq("id", purchaseInvoiceId);
}

export async function getPurchaseInvoice(
  client: SupabaseClient<Database>,
  purchaseInvoiceId: string
) {
  return client
    .from("purchaseInvoices")
    .select("*")
    .eq("id", purchaseInvoiceId)
    .single();
}

export async function getPurchaseInvoices(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    status: string | null;
    supplierId: string | null;
  }
) {
  let query = client.from("purchaseInvoices").select("*", { count: "exact" });

  if (args.search) {
    query = query.ilike("invoiceId", `%${args.search}%`);
  }

  if (args.status) {
    if (args.status === "closed") {
      query = query.eq("closed", true);
    } else {
      query = query.eq("status", args.status);
    }
  }

  if (args.supplierId) {
    query = query.eq("supplierId", args.supplierId);
  }

  query = setGenericQueryFilters(query, args, "invoiceId", false);
  return query;
}

export async function getPurchaseInvoiceLines(
  client: SupabaseClient<Database>,
  purchaseInvoiceId: string
) {
  return client
    .from("purchaseInvoiceLine")
    .select("*")
    .eq("purchaseInvoiceId", purchaseInvoiceId);
}

export async function upsertPurchaseInvoice(
  client: SupabaseClient<Database>,
  purchaseInvoice:
    | (Omit<
        TypeOfValidator<typeof purchaseInvoiceValidator>,
        "id" | "invoiceId"
      > & {
        invoiceId: string;
        createdBy: string;
      })
    | (Omit<
        TypeOfValidator<typeof purchaseInvoiceValidator>,
        "id" | "invoiceId"
      > & {
        id: string;
        invoiceId: string;
        updatedBy: string;
      })
) {
  if ("id" in purchaseInvoice) {
    return client
      .from("purchaseInvoice")
      .update(sanitize(purchaseInvoice))
      .eq("id", purchaseInvoice.id)
      .select("id, invoiceId");
  }

  const [supplier] = await Promise.all([
    getSupplier(client, purchaseInvoice.supplierId),
  ]);

  if (supplier.error) return supplier;

  const {
    defaultCurrencyCode,
    // defaultPaymentTermId,
    // defaultShippingMethodId,
    // defaultShippingTermId,
  } = supplier.data;

  const invoice = await client
    .from("purchaseInvoice")
    .insert([
      {
        ...purchaseInvoice,
        currencyCode:
          purchaseInvoice.currencyCode ?? defaultCurrencyCode ?? "USD",
      },
    ])
    .select("id, invoiceId");

  return invoice;
}
