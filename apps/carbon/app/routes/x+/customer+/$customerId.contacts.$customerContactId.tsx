import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  CustomerContactForm,
  customerContactValidator,
  getCustomerContact,
  updateCustomerContact,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { customerId, customerContactId } = params;
  if (!customerId) throw notFound("customerId not found");
  if (!customerContactId) throw notFound("customerContactId not found");

  const contact = await getCustomerContact(client, customerContactId);
  if (contact.error) {
    return redirect(
      path.to.customerContacts(customerId),
      await flash(
        request,
        error(contact.error, "Failed to get customer contact")
      )
    );
  }

  return json({
    contact: contact.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "sales",
  });

  const { customerId, customerContactId } = params;
  if (!customerId) throw notFound("customerId not found");
  if (!customerContactId) throw notFound("customerContactId not found");

  const validation = await customerContactValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, contactId, ...contact } = validation.data;

  if (id !== customerContactId)
    throw badRequest("customerContactId does not match id from form data");

  if (contactId === undefined)
    throw badRequest("contactId is undefined from form data");

  const update = await updateCustomerContact(client, {
    contactId,
    contact,
  });

  if (update.error) {
    return redirect(
      path.to.customerContacts(customerId),
      await flash(
        request,
        error(update.error, "Failed to update customer contact")
      )
    );
  }

  return redirect(
    path.to.customerContacts(customerId),
    await flash(request, success("Customer contact updated"))
  );
}

export default function EditCustomerContactRoute() {
  const { contact } = useLoaderData<typeof loader>();

  const initialValues = {
    id: contact?.id ?? undefined,
    contactId: contact?.contact?.id ?? undefined,
    firstName: contact?.contact?.firstName ?? "",
    lastName: contact?.contact?.lastName ?? "",
    email: contact?.contact?.email ?? "",
    title: contact?.contact?.title ?? "",
    mobilePhone: contact?.contact?.mobilePhone ?? "",
    homePhone: contact?.contact?.homePhone ?? "",
    workPhone: contact?.contact?.workPhone ?? "",
    fax: contact?.contact?.fax ?? "",
    addressLine1: contact?.contact?.addressLine1 ?? "",
    addressLine2: contact?.contact?.addressLine2 ?? "",
    city: contact?.contact?.city ?? "",
    state: contact?.contact?.state ?? "",
    postalCode: contact?.contact?.postalCode ?? "",
    birthday: contact?.contact?.birthday ?? undefined,
  };

  return <CustomerContactForm initialValues={initialValues} />;
}
