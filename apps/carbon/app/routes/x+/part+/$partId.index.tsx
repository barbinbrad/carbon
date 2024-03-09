import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { PartSummary } from "~/modules/parts";
import { PartForm, partValidator, upsertPart } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  // validate with partsValidator
  const validation = await validator(partValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePart = await upsertPart(client, {
    ...validation.data,
    id: partId,
    updatedBy: userId,
  });
  if (updatePart.error) {
    return redirect(
      path.to.part(partId),
      await flash(request, error(updatePart.error, "Failed to update part"))
    );
  }

  return redirect(
    path.to.part(partId),
    await flash(request, success("Updated part"))
  );
}

export default function PartBasicRoute() {
  const { partId } = useParams();
  if (!partId) throw new Error("Could not find partId");
  const partData = useRouteData<{ partSummary: PartSummary }>(
    path.to.part(partId)
  );
  if (!partData) throw new Error("Could not find part data");

  const initialValues = {
    id: partData.partSummary?.id ?? "",
    name: partData.partSummary?.name ?? "",
    description: partData.partSummary?.description ?? undefined,
    partType: partData.partSummary?.partType ?? "Inventory",
    partGroupId: partData.partSummary?.partGroupId ?? undefined,
    replenishmentSystem: partData.partSummary?.replenishmentSystem ?? "Buy",
    unitOfMeasureCode: partData.partSummary?.unitOfMeasureCode ?? "EA",
    blocked: partData.partSummary?.blocked ?? false,
    active: partData.partSummary?.active ?? false,
  };

  return <PartForm key={initialValues.id} initialValues={initialValues} />;
}
