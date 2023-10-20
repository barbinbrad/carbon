import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  insertSupplierLocation,
  SupplierLocationForm,
  supplierLocationValidator,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw notFound("supplierId not found");

  const validation = await supplierLocationValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, addressId, ...address } = validation.data;

  const createSupplierLocation = await insertSupplierLocation(client, {
    supplierId,
    address,
  });
  if (createSupplierLocation.error) {
    return redirect(
      path.to.supplierLocations(supplierId),
      await flash(
        request,
        error(
          createSupplierLocation.error,
          "Failed to create supplier location"
        )
      )
    );
  }

  return redirect(
    path.to.supplierLocations(supplierId),
    await flash(request, success("Supplier location created"))
  );
}

export default function SupplierLocationsNewRoute() {
  const initialValues = {};

  return <SupplierLocationForm initialValues={initialValues} />;
}
