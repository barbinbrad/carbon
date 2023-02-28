import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerForm } from "~/interfaces/Sales/Customers";
import { requirePermissions } from "~/services/auth";
import {
  getCustomer,
  getCustomerContacts,
  getCustomerLocations,
  customerValidator,
  updateCustomer,
} from "~/services/sales";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { customerId } = params;
  if (!customerId) throw notFound("customerTypeId not found");

  const [customer, contacts, locations] = await Promise.all([
    getCustomer(client, customerId),
    getCustomerContacts(client, customerId),
    getCustomerLocations(client, customerId),
  ]);
  if (customer.error)
    return redirect(
      "/x/sales/customers",
      await flash(request, error(customer.error, "Failed to get customer"))
    );

  if (contacts.error)
    return redirect(
      "/x/sales/customers",
      await flash(
        request,
        error(contacts.error, "Failed to get customer contacts")
      )
    );

  if (locations.error)
    return redirect(
      "/x/sales/customers",
      await flash(
        request,
        error(locations.error, "Failed to get customer locations")
      )
    );

  return json({
    customer: customer.data,
    contacts: contacts.data,
    locations: locations.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await customerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    id,
    name,
    customerTypeId,
    customerStatusId,
    accountManagerId,
    taxId,
    description,
  } = validation.data;

  if (!id) {
    return redirect(
      "/x/sales/customers",
      await flash(request, error(null, "Failed to update customer"))
    );
  }

  const update = await updateCustomer(client, {
    id,
    name,
    customerTypeId,
    customerStatusId,
    accountManagerId,
    taxId,
    description,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      "/x/sales/customers",
      await flash(request, error(update.error, "Failed to update customer"))
    );
  }

  return json(null, await flash(request, success("Updated customer")));
}

export default function CustomersNewRoute() {
  const { customer, contacts, locations } = useLoaderData<typeof loader>();

  const initialValues = {
    id: customer.id ?? undefined,
    name: customer.name ?? "",
    customerTypeId: customer.customerTypeId ?? undefined,
    customerStatusId: customer.customerStatusId ?? undefined,
    accountManagerId: customer.accountManagerId ?? undefined,
    taxId: customer.taxId ?? "",
    description: customer.description ?? "",
  };

  return (
    <CustomerForm
      initialValues={initialValues}
      contacts={contacts ?? []}
      locations={locations ?? []}
    />
  );
}
