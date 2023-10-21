import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { UnitOfMeasureListItem } from "~/modules/parts";
import {
  getPartPurchasing,
  PartPurchasingForm,
  partPurchasingValidator,
  upsertPartPurchasing,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const partPurchasing = await getPartPurchasing(client, partId);

  if (partPurchasing.error) {
    return redirect(
      path.to.parts,
      await flash(
        request,
        error(partPurchasing.error, "Failed to load part purchasing")
      )
    );
  }

  return json({
    partPurchasing: partPurchasing.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  // validate with partsValidator
  const validation = await partPurchasingValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartPurchasing = await upsertPartPurchasing(client, {
    ...validation.data,
    partId,
    updatedBy: userId,
  });
  if (updatePartPurchasing.error) {
    return redirect(
      path.to.part(partId),
      await flash(
        request,
        error(updatePartPurchasing.error, "Failed to update part purchasing")
      )
    );
  }

  return redirect(
    path.to.partPurchasing(partId),
    await flash(request, success("Updated part purchasing"))
  );
}

export default function PartPurchasingRoute() {
  const sharedPartData = useRouteData<{
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.partRoot);
  const { partPurchasing } = useLoaderData<typeof loader>();

  const initialValues = {
    ...partPurchasing,
    preferredSupplierId: partPurchasing?.preferredSupplierId ?? undefined,
    purchasingLeadTime: partPurchasing?.purchasingLeadTime ?? "",
    purchasingBlocked: partPurchasing?.purchasingBlocked ?? false,
    purchasingUnitOfMeasureCode:
      partPurchasing?.purchasingUnitOfMeasureCode ?? "",
    conversionFactor: partPurchasing?.conversionFactor ?? 1,
  };

  return (
    <PartPurchasingForm
      initialValues={initialValues}
      unitOfMeasures={sharedPartData?.unitOfMeasures ?? []}
    />
  );
}
