import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  SupplierLocationForm,
  getSupplierLocation,
  supplierLocationValidator,
  updateSupplierLocation,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId, supplierLocationId } = params;
  if (!supplierId) throw notFound("supplierId not found");
  if (!supplierLocationId) throw notFound("supplierLocationId not found");

  const location = await getSupplierLocation(client, supplierLocationId);
  if (location.error) {
    return redirect(
      path.to.supplierLocations(supplierId),
      await flash(
        request,
        error(location.error, "Failed to get supplier location")
      )
    );
  }

  return json({
    location: location.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { supplierId, supplierLocationId } = params;
  if (!supplierId) throw notFound("supplierId not found");
  if (!supplierLocationId) throw notFound("supplierLocationId not found");

  const validation = await validator(supplierLocationValidator).validate(
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
      path.to.supplierLocations(supplierId),
      await flash(
        request,
        error(update.error, "Failed to update supplier address")
      )
    );
  }

  return redirect(
    path.to.supplierLocations(supplierId),
    await flash(request, success("Supplier address updated"))
  );
}

export default function EditSupplierLocationRoute() {
  const { location } = useLoaderData<typeof loader>();

  const initialValues = {
    id: location?.id ?? undefined,
    addressId: location?.address?.id ?? undefined,

    addressLine1: location?.address?.addressLine1 ?? "",
    addressLine2: location?.address?.addressLine2 ?? "",
    city: location?.address?.city ?? "",
    state: location?.address?.state ?? "",
    postalCode: location?.address?.postalCode ?? "",
  };

  return (
    <SupplierLocationForm
      key={initialValues.id}
      initialValues={initialValues}
    />
  );
}
