import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { SupplierDetail } from "~/modules/purchasing";
import {
  SupplierForm,
  supplierValidator,
  updateSupplier,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await supplierValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  if (!id) {
    return redirect(
      path.to.suppliers,
      await flash(request, error(null, "Failed to update supplier"))
    );
  }

  const update = await updateSupplier(client, {
    id,
    ...data,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.suppliers,
      await flash(request, error(update.error, "Failed to update supplier"))
    );
  }

  return json(null, await flash(request, success("Updated supplier")));
}

export default function SupplierEditRoute() {
  const { supplierId } = useParams();
  if (!supplierId) throw new Error("Could not find supplierId");
  const routeData = useRouteData<{ supplier: SupplierDetail }>(
    path.to.supplier(supplierId)
  );

  if (!routeData?.supplier) return null;

  const initialValues = {
    id: routeData?.supplier?.id ?? undefined,
    name: routeData?.supplier?.name ?? "",
    supplierTypeId: routeData?.supplier?.supplierTypeId ?? undefined,
    supplierStatusId: routeData?.supplier?.supplierStatusId ?? undefined,
    accountManagerId: routeData?.supplier?.accountManagerId ?? undefined,
    taxId: routeData?.supplier?.taxId ?? "",
    defaultCurrencyCode: routeData?.supplier?.defaultCurrencyCode ?? "",
    defaultPaymentTermId:
      routeData?.supplier?.defaultPaymentTermId ?? undefined,
    defaultShippingMethodId:
      routeData?.supplier?.defaultShippingMethodId ?? undefined,
    defaultShippingTermId:
      routeData?.supplier?.defaultShippingTermId ?? undefined,
  };

  return <SupplierForm initialValues={initialValues} />;
}
