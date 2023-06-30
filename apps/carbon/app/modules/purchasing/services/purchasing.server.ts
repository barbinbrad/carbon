import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { getEmployeeJob } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import { sanitize } from "~/utils/supabase";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import type {
  purchaseOrderDeliveryValidator,
  purchaseOrderLineValidator,
  purchaseOrderValidator,
  supplierValidator,
} from "./purchasing.form";

export async function closePurchaseOrder(
  client: SupabaseClient<Database>,
  purchaseOrderId: string,
  userId: string
) {
  return client
    .from("purchaseOrder")
    .update({
      closed: true,
      closedAt: new Date().toISOString(),
      closedBy: userId,
    })
    .eq("id", purchaseOrderId)
    .select("id");
}

export async function deletePurchaseOrder(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return Promise.all([
    client.from("purchaseOrder").delete().eq("id", purchaseOrderId),
    client.from("purchaseOrderDelivery").delete().eq("id", purchaseOrderId),
    client.from("purchaseOrderPayment").delete().eq("id", purchaseOrderId),
  ]);
}

export async function deleteSupplierContact(
  client: SupabaseClient<Database>,
  supplierId: string,
  supplierContactId: string
) {
  return client
    .from("supplierContact")
    .delete()
    .eq("supplierId", supplierId)
    .eq("id", supplierContactId);
}

export async function deleteSupplierLocation(
  client: SupabaseClient<Database>,
  supplierId: string,
  supplierLocationId: string
) {
  return client
    .from("supplierLocation")
    .delete()
    .eq("supplierId", supplierId)
    .eq("id", supplierLocationId);
}

export async function deleteSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: string
) {
  return client.from("supplierType").delete().eq("id", supplierTypeId);
}

export async function getExternalDocuments(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client.storage.from("purchasing-external").list(purchaseOrderId);
}

export async function getInternalDocuments(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client.storage.from("purchasing-internal").list(purchaseOrderId);
}

export async function getPurchaseOrder(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client
    .from("purchase_order_view")
    .select("*")
    .eq("id", purchaseOrderId)
    .single();
}

export async function getPurchaseOrders(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    search: string | null;
    status: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("purchase_order_view")
    .select("*", { count: "exact" });

  if (args.search) {
    query = query.ilike("purchaseOrderId", `%${args.search}%`);
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

  query = setGenericQueryFilters(query, args, "purchaseOrderId");
  return query;
}

export async function getPurchaseOrderDelivery(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client
    .from("purchaseOrderDelivery")
    .select("*")
    .eq("id", purchaseOrderId)
    .single();
}

export function getPurchaseOrderApprovalStatuses(): Database["public"]["Enums"]["purchaseOrderApprovalStatus"][] {
  return [
    "Draft",
    "In Review",
    "In External Review",
    "Approved",
    "Rejected",
    "Confirmed",
  ];
}

export async function getPurchaseOrderLines(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client
    .from("purchaseOrderLine")
    .select("*")
    .eq("purchaseOrderId", purchaseOrderId);
}

export async function getPurchaseOrderLine(
  client: SupabaseClient<Database>,
  purchaseOrderLineId: string
) {
  return client
    .from("purchaseOrderLine")
    .select("*")
    .eq("id", purchaseOrderLineId)
    .single();
}

export function getPurchaseOrderLineTypes(): Database["public"]["Enums"]["purchaseOrderLineType"][] {
  return ["Part", "G/L Account", "Fixed Asset", "Comment"];
}

export function getPurchaseOrderTypes(): Database["public"]["Enums"]["purchaseOrderType"][] {
  return ["Draft", "Purchase", "Return"];
}

export async function getSupplier(
  client: SupabaseClient<Database>,
  supplierId: string
) {
  return client.from("supplier").select("*").eq("id", supplierId).single();
}

export async function getSupplierLocations(
  client: SupabaseClient<Database>,
  supplierId: string
) {
  return client
    .from("supplierLocation")
    .select(
      "id, address(id, addressLine1, addressLine2, city, state, country(id, name), postalCode)"
    )
    .eq("supplierId", supplierId);
}

export async function getSupplierContact(
  client: SupabaseClient<Database>,
  supplierContactId: string
) {
  return client
    .from("supplierContact")
    .select(
      "id, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, addressLine1, addressLine2, city, state, postalCode, country(id, name), birthday, notes)"
    )
    .eq("id", supplierContactId)
    .single();
}

export async function getSupplierContacts(
  client: SupabaseClient<Database>,
  supplierId: string
) {
  return client
    .from("supplierContact")
    .select(
      "id, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, addressLine1, addressLine2, city, state, postalCode, country(id, name), birthday, notes), user(id, active)"
    )
    .eq("supplierId", supplierId);
}

export async function getSuppliers(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    status: string | null;
  }
) {
  let query = client
    .from("supplier")
    .select("id, name, supplierType(name), supplierStatus(name)", {
      count: "exact",
    });

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args.type) {
    query = query.eq("supplierTypeId", args.type);
  }

  if (args.status) {
    query = query.eq("supplierStatusId", args.status);
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getSuppliersList(client: SupabaseClient<Database>) {
  return client.from("supplier").select("id, name");
}

export async function getSupplierStatuses(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("supplierStatus")
    .select("id, name", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getSupplierType(
  client: SupabaseClient<Database>,
  supplierTypeId: string
) {
  return client
    .from("supplierType")
    .select("id, name, color, protected")
    .eq("id", supplierTypeId)
    .single();
}

export async function getSupplierTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("supplierType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function insertSupplier(
  client: SupabaseClient<Database>,
  supplier: TypeOfValidator<typeof supplierValidator> & {
    createdBy: string;
  }
) {
  return client.from("supplier").insert([supplier]).select("id");
}

export async function insertSupplierContact(
  client: SupabaseClient<Database>,
  supplierContact: {
    supplierId: string;
    contact: {
      firstName: string;
      lastName: string;
      email: string;
      mobilePhone?: string;
      homePhone?: string;
      workPhone?: string;
      fax?: string;
      title?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      birthday?: string;
      notes?: string;
    };
  }
) {
  // Need to use service role here because it violates RLS
  // to select a contact that does not belong to any supplier
  const insertContact = await getSupabaseServiceRole()
    .from("contact")
    .insert([supplierContact.contact])
    .select("id");
  if (insertContact.error) {
    return insertContact;
  }

  const contactId = insertContact.data[0].id;
  if (!contactId) {
    return { data: null, error: new Error("Contact ID not found") };
  }

  return client
    .from("supplierContact")
    .insert([
      {
        supplierId: supplierContact.supplierId,
        contactId,
      },
    ])
    .select("id");
}

export async function insertSupplierLocation(
  client: SupabaseClient<Database>,
  supplierLocation: {
    supplierId: string;
    address: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
    };
  }
) {
  const insertAddress = await client
    .from("address")
    .insert([supplierLocation.address])
    .select("id");
  if (insertAddress.error) {
    return insertAddress;
  }

  const addressId = insertAddress.data[0].id;
  if (!addressId) {
    return { data: null, error: new Error("Address ID not found") };
  }

  return client
    .from("supplierLocation")
    .insert([
      {
        supplierId: supplierLocation.supplierId,
        addressId,
      },
    ])
    .select("id");
}

export async function updateSupplier(
  client: SupabaseClient<Database>,
  supplier: Omit<TypeOfValidator<typeof supplierValidator>, "id"> & {
    id: string;
    updatedBy: string;
  }
) {
  return client
    .from("supplier")
    .update(sanitize(supplier))
    .eq("id", supplier.id)
    .select("id");
}

export async function updateSupplierContact(
  client: SupabaseClient<Database>,
  supplierContact: {
    contactId: string;
    contact: {
      firstName?: string;
      lastName?: string;
      email: string;
      mobilePhone?: string;
      homePhone?: string;
      workPhone?: string;
      fax?: string;
      title?: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
      birthday?: string;
      notes?: string;
    };
  }
) {
  return client
    .from("contact")
    .update(sanitize(supplierContact.contact))
    .eq("id", supplierContact.contactId)
    .select("id");
}

export async function updateSupplierLocation(
  client: SupabaseClient<Database>,
  supplierLocation: {
    addressId: string;
    address: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      // countryId: string;
      postalCode?: string;
    };
  }
) {
  return client
    .from("address")
    .update(sanitize(supplierLocation.address))
    .eq("id", supplierLocation.addressId)
    .select("id");
}

export async function upsertPurchaseOrder(
  client: SupabaseClient<Database>,
  purchaseOrder:
    | (Omit<
        TypeOfValidator<typeof purchaseOrderValidator>,
        "id" | "purchaseOrderId"
      > & {
        purchaseOrderId: string;
        createdBy: string;
      })
    | (Omit<
        TypeOfValidator<typeof purchaseOrderValidator>,
        "id" | "purchaseOrderId"
      > & {
        id: string;
        purchaseOrderId: string;
        updatedBy: string;
      })
) {
  if ("id" in purchaseOrder) {
    return client
      .from("purchaseOrder")
      .update(sanitize(purchaseOrder))
      .eq("id", purchaseOrder.id)
      .select("id, purchaseOrderId");
  }

  const [supplier, purchaser] = await Promise.all([
    getSupplier(client, purchaseOrder.supplierId),
    getEmployeeJob(client, purchaseOrder.createdBy),
  ]);

  if (supplier.error) return supplier;

  const {
    defaultCurrencyCode,
    defaultPaymentTermId,
    defaultShippingMethodId,
    defaultShippingTermId,
  } = supplier.data;

  const locationId = purchaser?.data?.locationId ?? null;

  const order = await client
    .from("purchaseOrder")
    .insert([{ ...purchaseOrder }])
    .select("id, purchaseOrderId");

  if (order.error) return order;

  const purchaseOrderId = order.data[0].id;

  const [delivery, payment] = await Promise.all([
    client.from("purchaseOrderDelivery").insert([
      {
        id: purchaseOrderId,
        locationId: locationId,
        shippingMethodId: defaultShippingMethodId,
        shippingTermId: defaultShippingTermId,
      },
    ]),
    client.from("purchaseOrderPayment").insert([
      {
        id: purchaseOrderId,
        currencyCode: defaultCurrencyCode ?? "USD",
        invoiceSupplierId: purchaseOrder.supplierId,
        paymentTermId: defaultPaymentTermId,
      },
    ]),
  ]);

  if (delivery.error) {
    await deletePurchaseOrder(client, purchaseOrderId);
    return payment;
  }
  if (payment.error) {
    await deletePurchaseOrder(client, purchaseOrderId);
    return payment;
  }

  return order;
}

export async function upsertPurchaseOrderDelivery(
  client: SupabaseClient<Database>,
  purchaseOrderDelivery:
    | (TypeOfValidator<typeof purchaseOrderDeliveryValidator> & {
        createdBy: string;
      })
    | (TypeOfValidator<typeof purchaseOrderDeliveryValidator> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("id" in purchaseOrderDelivery) {
    return client
      .from("purchaseOrderDelivery")
      .update(sanitize(purchaseOrderDelivery))
      .eq("id", purchaseOrderDelivery.id)
      .select("id");
  }
  return client
    .from("purchaseOrderDelivery")
    .insert([purchaseOrderDelivery])
    .select("id");
}

export async function upsertPurchaseOrderLine(
  client: SupabaseClient<Database>,
  purchaseOrderLine:
    | (Omit<TypeOfValidator<typeof purchaseOrderLineValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof purchaseOrderLineValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("id" in purchaseOrderLine) {
    return client
      .from("purchaseOrderLine")
      .update(sanitize(purchaseOrderLine))
      .eq("id", purchaseOrderLine.id)
      .select("id");
  }
  return client
    .from("purchaseOrderLine")
    .insert([purchaseOrderLine])
    .select("id");
}

export async function upsertSupplierType(
  client: SupabaseClient<Database>,
  supplierType: { id?: string; name: string; color: string | null }
) {
  return client.from("supplierType").upsert([supplierType]).select("id");
}
