import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  insertSupplierContact,
  supplierContactValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw notFound("supplierId not found");

  const validation = await supplierContactValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, contactId, ...contact } = validation.data;

  const createSupplierContact = await insertSupplierContact(client, {
    supplierId,
    contact,
  });
  if (createSupplierContact.error) {
    return redirect(
      `/x/purchasing/suppliers/${supplierId}`,
      await flash(
        request,
        error(createSupplierContact.error, "Failed to create supplier contact")
      )
    );
  }

  return redirect(
    `/x/purchasing/suppliers/${supplierId}`,
    await flash(request, success("Supplier contact created"))
  );
}
