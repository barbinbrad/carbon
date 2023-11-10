import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  SupplierShippingForm,
  getSupplierShipping,
  supplierShippingValidator,
  updateSupplierShipping,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const supplierShipping = await getSupplierShipping(client, supplierId);

  if (supplierShipping.error || !supplierShipping.data) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(supplierShipping.error, "Failed to load supplier shipping")
      )
    );
  }

  return json({
    supplierShipping: supplierShipping.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  // validate with purchasingValidator
  const validation = await supplierShippingValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await updateSupplierShipping(client, {
    ...validation.data,
    supplierId,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(update.error, "Failed to update supplier shipping")
      )
    );
  }

  return redirect(
    path.to.supplierShipping(supplierId),
    await flash(request, success("Updated supplier shipping"))
  );
}

export default function SupplierShippingRoute() {
  const { supplierShipping } = useLoaderData<typeof loader>();
  const initialValues = {
    supplierId: supplierShipping?.supplierId ?? "",
    shippingSupplierId: supplierShipping?.shippingSupplierId ?? "",
    shippingSupplierContactId:
      supplierShipping?.shippingSupplierContactId ?? "",
    shippingSupplierLocationId:
      supplierShipping?.shippingSupplierLocationId ?? "",
    shippingMethodId: supplierShipping?.shippingMethodId ?? "",
    shippingTermId: supplierShipping?.shippingTermId ?? "",
  };

  return <SupplierShippingForm initialValues={initialValues} />;
}
