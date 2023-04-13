import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getPartPurchasing,
  PartPurchasingForm,
  partPurchasingValidator,
  upsertPartPurchasing,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const partPurchasing = await getPartPurchasing(client, partId);

  if (partPurchasing.error) {
    return redirect(
      "/x/parts",
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

export async function action({ request, params }: ActionArgs) {
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
      `/x/part/${partId}`,
      await flash(
        request,
        error(updatePartPurchasing.error, "Failed to update part purchasing")
      )
    );
  }

  return redirect(
    `/x/part/${partId}/purchasing`,
    await flash(request, success("Updated part purchasing"))
  );
}

export default function PartPurchasingRoute() {
  const { partPurchasing } = useLoaderData<typeof loader>();

  const initialValues = {
    ...partPurchasing,
    supplierId: partPurchasing?.supplierId ?? undefined,
    supplierPartNumber: partPurchasing?.supplierPartNumber ?? undefined,
    purchasingUnitOfMeasureCode:
      partPurchasing?.purchasingUnitOfMeasureCode ?? "",
  };

  return <PartPurchasingForm initialValues={initialValues} />;
}
