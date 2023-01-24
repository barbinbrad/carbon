import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  updateSupplierContact,
  supplierContactValidator,
} from "~/services/purchasing";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
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
      `/app/purchasing/suppliers/${supplierId}`,
      await flash(
        request,
        error(update.error, "Failed to update supplier contact")
      )
    );
  }

  return redirect(
    `/app/purchasing/suppliers/${supplierId}`,
    await flash(request, success("Supplier contact updated"))
  );
}
