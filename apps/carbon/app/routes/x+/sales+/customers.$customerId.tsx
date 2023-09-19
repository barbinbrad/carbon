import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  CustomerForm,
  customerValidator,
  getCustomer,
  getCustomerContacts,
  getCustomerLocations,
  updateCustomer,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
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

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await customerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  if (!id) {
    return redirect(
      "/x/sales/customers",
      await flash(request, error(null, "Failed to update customer"))
    );
  }

  const update = await updateCustomer(client, {
    id,
    ...data,
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
  };

  return (
    <CustomerForm
      initialValues={initialValues}
      contacts={contacts ?? []}
      locations={locations ?? []}
    />
  );
}
