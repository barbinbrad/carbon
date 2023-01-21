import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";

export async function deleteCustomerContact(
  client: SupabaseClient<Database>,
  customerId: string,
  customerContactId: string
) {
  return client
    .from("customerContact")
    .delete()
    .eq("customerId", customerId)
    .eq("id", customerContactId);
}

export async function deleteCustomerLocation(
  client: SupabaseClient<Database>,
  customerId: string,
  customerLocationId: number
) {
  return client
    .from("customerLocation")
    .delete()
    .eq("customerId", customerId)
    .eq("id", customerLocationId);
}

export async function deleteCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: string
) {
  return client.from("customerType").delete().eq("id", customerTypeId);
}

export async function getCustomer(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customer")
    .select(
      "id, name, description, customerTypeId, customerStatusId, taxId, accountManagerId"
    )
    .eq("id", customerId)
    .single();
}

export async function getCustomerLocations(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerLocation")
    .select(
      "id, address(id, addressLine1, addressLine2, city, state, country(id, name), postalCode)"
    )
    .eq("customerId", customerId);
}

export async function getCustomerContacts(
  client: SupabaseClient<Database>,
  customerId: string
) {
  return client
    .from("customerContact")
    .select(
      "id, contact(id, firstName, lastName, email, mobilePhone, homePhone, workPhone, fax, title, addressLine1, addressLine2, city, state, postalCode, country(id, name), birthday, notes)"
    )
    .eq("customerId", customerId);
}

export async function getCustomers(
  client: SupabaseClient<Database>,
  args: GenericQueryFilters & {
    name: string | null;
    type: string | null;
    status: string | null;
  }
) {
  let query = client
    .from("customer")
    .select("id, name, description, customerType(name), customerStatus(name)", {
      count: "exact",
    });

  if (args.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args.type) {
    query = query.eq("customerTypeId", args.type);
  }

  if (args.status) {
    query = query.eq("customerStatusId", Number(args.status));
  }

  query = setGenericQueryFilters(query, args, "name");
  return query;
}

export async function getCustomersList(client: SupabaseClient<Database>) {
  return client.from("customer").select("id, name");
}

export async function getCustomerStatuses(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("customerStatus")
    .select("id, name", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function getCustomerType(
  client: SupabaseClient<Database>,
  customerTypeId: string
) {
  return client
    .from("customerType")
    .select("id, name, color, protected")
    .eq("id", customerTypeId)
    .single();
}

export async function getCustomerTypes(
  client: SupabaseClient<Database>,
  args?: GenericQueryFilters & { name: string | null }
) {
  let query = client
    .from("customerType")
    .select("id, name, color, protected", { count: "exact" });

  if (args?.name) {
    query = query.ilike("name", `%${args.name}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, "name");
  }

  return query;
}

export async function insertCustomer(
  client: SupabaseClient<Database>,
  customer: {
    name: string;
    customerTypeId?: string;
    customerStatusId?: number;
    taxId?: string;
    accountManagerId?: string;
    description?: string;
    createdBy: string;
  }
) {
  return client.from("customer").insert([customer]).select("id");
}

export async function insertCustomerContact(
  client: SupabaseClient<Database>,
  customerContact: {
    customerId: string;
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
  const insertContact = await client
    .from("contact")
    .insert([customerContact.contact])
    .select("id");
  if (insertContact.error) {
    return insertContact;
  }

  const contactId = insertContact.data[0].id;
  if (!contactId) {
    return { data: null, error: new Error("Contact ID not found") };
  }

  return client
    .from("customerContact")
    .insert([
      {
        customerId: customerContact.customerId,
        contactId,
      },
    ])
    .select("id");
}

export async function insertCustomerLocation(
  client: SupabaseClient<Database>,
  customerLocation: {
    customerId: string;
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
    .insert([customerLocation.address])
    .select("id");
  if (insertAddress.error) {
    return insertAddress;
  }

  const addressId = insertAddress.data[0].id;
  if (!addressId) {
    return { data: null, error: new Error("Address ID not found") };
  }

  return client
    .from("customerLocation")
    .insert([
      {
        customerId: customerLocation.customerId,
        addressId,
      },
    ])
    .select("id");
}

export async function updateCustomer(
  client: SupabaseClient<Database>,
  customer: {
    id: string;
    name: string;
    customerTypeId?: string;
    customerStatusId?: number;
    taxId?: string;
    accountManagerId?: string;
    description?: string;
    updatedBy: string;
  }
) {
  return client
    .from("customer")
    .update(customer)
    .eq("id", customer.id)
    .select("id");
}

export async function updateCustomerContact(
  client: SupabaseClient<Database>,
  customerContact: {
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
    .update(customerContact.contact)
    .eq("id", customerContact.contactId)
    .select("id");
}

export async function updateCustomerLocation(
  client: SupabaseClient<Database>,
  customerLocation: {
    addressId: number;
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
    .update(customerLocation.address)
    .eq("id", customerLocation.addressId)
    .select("id");
}

export async function upsertCustomerType(
  client: SupabaseClient<Database>,
  customerType: { id?: string; name: string; color: string | null }
) {
  return client.from("customerType").upsert([customerType]).select("id");
}
