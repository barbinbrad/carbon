import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteSupplierLocation } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { supplierId, supplierLocationId } = params;
  if (!supplierId || !supplierLocationId) {
    return redirect(
      path.to.suppliers,
      await flash(
        request,
        error(params, "Failed to get a supplier location id")
      )
    );
  }

  const { error: deleteSupplierLocationError } = await deleteSupplierLocation(
    client,
    supplierId,
    supplierLocationId
  );
  if (deleteSupplierLocationError) {
    return redirect(
      path.to.supplierLocations(supplierId),
      await flash(
        request,
        error(deleteSupplierLocationError, "Failed to delete supplier location")
      )
    );
  }

  return redirect(
    path.to.supplierLocations(supplierId),
    await flash(request, success("Successfully deleted supplier location"))
  );
}
