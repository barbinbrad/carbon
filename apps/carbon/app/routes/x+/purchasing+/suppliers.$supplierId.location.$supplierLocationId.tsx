import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  updateSupplierLocation,
  supplierLocationValidator,
} from "~/services/purchasing";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { supplierId, supplierLocationId } = params;
  if (!supplierId) throw notFound("supplierId not found");
  if (!supplierLocationId) throw notFound("supplierLocationId not found");

  const validation = await supplierLocationValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, addressId, ...address } = validation.data;

  if (addressId === undefined)
    throw badRequest("addressId is undefined in form data");

  const update = await updateSupplierLocation(client, {
    addressId,
    address,
  });
  if (update.error) {
    return redirect(
      `/x/purchasing/suppliers/${supplierId}`,
      await flash(
        request,
        error(update.error, "Failed to update supplier address")
      )
    );
  }

  return redirect(
    `/x/purchasing/suppliers/${supplierId}`,
    await flash(request, success("Supplier address updated"))
  );
}
