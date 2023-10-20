import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getSupplierContact,
  SupplierContactForm,
  supplierContactValidator,
  updateSupplierContact,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId, supplierContactId } = params;
  if (!supplierId) throw notFound("supplierId not found");
  if (!supplierContactId) throw notFound("supplierContactId not found");

  const contact = await getSupplierContact(client, supplierContactId);
  if (contact.error) {
    return redirect(
      path.to.supplierContacts(supplierId),
      await flash(
        request,
        error(contact.error, "Failed to get supplier contact")
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
    update: "purchasing",
  });

  const { supplierId, supplierContactId } = params;
  if (!supplierId) throw notFound("supplierId not found");
  if (!supplierContactId) throw notFound("supplierContactId not found");

  const validation = await supplierContactValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, contactId, ...contact } = validation.data;

  if (id !== supplierContactId)
    throw badRequest("supplierContactId does not match id from form data");

  if (contactId === undefined)
    throw badRequest("contactId is undefined from form data");

  const update = await updateSupplierContact(client, {
    contactId,
    contact,
  });

  if (update.error) {
    return redirect(
      path.to.supplierContacts(supplierId),
      await flash(
        request,
        error(update.error, "Failed to update supplier contact")
      )
    );
  }

  return redirect(
    path.to.supplierContacts(supplierId),
    await flash(request, success("Supplier contact updated"))
  );
}

export default function EditSupplierContactRoute() {
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

  return <SupplierContactForm initialValues={initialValues} />;
}
