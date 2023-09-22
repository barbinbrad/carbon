import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteSupplierContact } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { supplierId, supplierContactId } = params;
  if (!supplierId || !supplierContactId) {
    return redirect(
      "/x/purchasing/suppliers",
      await flash(request, error(params, "Failed to get a supplier contact id"))
    );
  }

  const { error: deleteSupplierContactError } = await deleteSupplierContact(
    client,
    supplierId,
    supplierContactId
  );
  if (deleteSupplierContactError) {
    return redirect(
      `/x/supplier/${supplierId}/contacts`,
      await flash(
        request,
        error(deleteSupplierContactError, "Failed to delete supplier contact")
      )
    );
  }

  return redirect(
    `/x/supplier/${supplierId}/contacts`,
    await flash(request, success("Successfully deleted supplier contact"))
  );
}
