import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteSupplierLocation } from "~/services/purchasing";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { supplierId, supplierLocationId } = params;
  if (!supplierId || !supplierLocationId) {
    return redirect(
      "/app/purchasing/suppliers",
      await flash(
        request,
        error(params, "Failed to get a supplier location id")
      )
    );
  }

  const { error: deleteSupplierLocationError } = await deleteSupplierLocation(
    client,
    supplierId,
    Number(supplierLocationId)
  );
  if (deleteSupplierLocationError) {
    return redirect(
      `/app/purchasing/suppliers/${supplierId}`,
      await flash(
        request,
        error(deleteSupplierLocationError, "Failed to delete supplier location")
      )
    );
  }

  return redirect(
    `/app/purchasing/suppliers/${supplierId}`,
    await flash(request, success("Successfully deleted supplier location"))
  );
}
