import type { Database } from "@carbon/database";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { getEmployeeJob } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type {
  purchaseOrderDeliveryValidator,
  purchaseOrderLineValidator,
  purchaseOrderPaymentValidator,
  purchaseOrderValidator,
  supplierTypeValidator,
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
      closedAt: today(getLocalTimeZone()).toString(),
      closedBy: userId,
    })
    .eq("id", purchaseOrderId)
    .select("id")
    .single();
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

export async function deletePurchaseOrderLine(
  client: SupabaseClient<Database>,
  purchaseOrderLineId: string
) {
  return client
    .from("purchaseOrderLine")
    .delete()
    .eq("id", purchaseOrderLineId);
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

  query = setGenericQueryFilters(query, args, "purchaseOrderId", false);
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

export async function getPurchaseOrderPayment(
  client: SupabaseClient<Database>,
  purchaseOrderId: string
) {
  return client
    .from("purchaseOrderPayment")
    .select("*")
    .eq("id", purchaseOrderId)
    .single();
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

export async function getPurchaseOrderSuppliers(
  client: SupabaseClient<Database>
) {
  return client.from("purchase_order_suppliers_view").select("id, name");
}

export async function getSupplier(
  client: SupabaseClient<Database>,
  supplierId: string
) {
  return client.from("supplier").select("*").eq("id", supplierId).single();
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

export async function getSupplierLocation(
  client: SupabaseClient<Database>,
  supplierContactId: string
) {
  return client
    .from("supplierLocation")
    .select(
      "id, address(id, addressLine1, addressLine2, city, state, country(id, name), postalCode)"
    )
    .eq("id", supplierContactId)
    .single();
}

export async function getSuppliers(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    status: string | null;
  }
) {
  let query = client.from("suppliers_view").select("*", {
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

export async function getSupplierTypesList(client: SupabaseClient<Database>) {
  return client.from("supplierType").select("id, name");
}

export async function insertSupplier(
  client: SupabaseClient<Database>,
  supplier:
    | (Omit<TypeOfValidator<typeof supplierValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof supplierValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  return client.from("supplier").insert([supplier]).select("id").single();
}

export async function getUninvoicedReceipts(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & {
    supplier: string | null;
  }
) {
  let query = client.from("receipts_posted_not_invoiced").select("*");

  if (args?.supplier) {
    query = query.eq("supplierId", args.supplier);
  }

  if (args)
    if (args) {
      query = setGenericQueryFilters(query, args, "name");
    }

  return query;
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
    .select("id")
    .single();
  if (insertContact.error) {
    return insertContact;
  }

  const contactId = insertContact.data?.id;
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
    .select("id")
    .single();
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
    .select("id")
    .single();
  if (insertAddress.error) {
    return insertAddress;
  }

  const addressId = insertAddress.data?.id;
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
    .select("id")
    .single();
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
    .select("id")
    .single();
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
    .select("id")
    .single();
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
    .select("id")
    .single();
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
      .select("id")
      .single();
  }
  return client
    .from("purchaseOrderDelivery")
    .insert([purchaseOrderDelivery])
    .select("id")
    .single();
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
      .select("id")
      .single();
  }
  return client
    .from("purchaseOrderLine")
    .insert([purchaseOrderLine])
    .select("id")
    .single();
}

export async function upsertPurchaseOrderPayment(
  client: SupabaseClient<Database>,
  purchaseOrderPayment:
    | (TypeOfValidator<typeof purchaseOrderPaymentValidator> & {
        createdBy: string;
      })
    | (TypeOfValidator<typeof purchaseOrderPaymentValidator> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("id" in purchaseOrderPayment) {
    return client
      .from("purchaseOrderPayment")
      .update(sanitize(purchaseOrderPayment))
      .eq("id", purchaseOrderPayment.id)
      .select("id")
      .single();
  }
  return client
    .from("purchaseOrderPayment")
    .insert([purchaseOrderPayment])
    .select("id")
    .single();
}

export async function upsertSupplierType(
  client: SupabaseClient<Database>,
  supplierType:
    | (Omit<TypeOfValidator<typeof supplierTypeValidator>, "id"> & {
        createdBy: string;
      })
    | (Omit<TypeOfValidator<typeof supplierTypeValidator>, "id"> & {
        id: string;
        updatedBy: string;
      })
) {
  if ("createdBy" in supplierType) {
    return client.from("supplierType").insert([supplierType]);
  } else {
    return client
      .from("supplierType")
      .update(sanitize(supplierType))
      .eq("id", supplierType.id);
  }
}
