import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type {
  PartGroupListItem,
  PartReplenishmentSystem,
  PartSummary,
  PartType,
  UnitOfMeasureListItem,
} from "~/modules/parts";
import { PartForm, partValidator, upsertPart } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  // validate with partsValidator
  const validation = await partValidator.validate(await request.formData());

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
      `/x/part/${partId}`,
      await flash(request, error(updatePart.error, "Failed to update part"))
    );
  }

  return redirect(
    `/x/part/${partId}`,
    await flash(request, success("Updated part"))
  );
}

export default function PartBasicRoute() {
  const sharedPartsData = useRouteData<{
    partGroups: PartGroupListItem[];
    partTypes: PartType[];
    partReplenishmentSystems: PartReplenishmentSystem[];
    unitOfMeasures: UnitOfMeasureListItem[];
  }>("/x/part");

  const { partId } = useParams();
  const partData = useRouteData<{ partSummary: PartSummary }>(
    `/x/part/${partId}`
  );
  if (!partData) throw new Error("Could not find part data");

  const initialValues = {
    id: partData.partSummary?.id,
    name: partData.partSummary?.name ?? "",
    description: partData.partSummary?.description ?? undefined,
    partType: partData.partSummary?.partType,
    partGroupId: partData.partSummary?.partGroupId ?? undefined,
    replenishmentSystem: partData.partSummary?.replenishmentSystem,
    unitOfMeasureCode: partData.partSummary?.unitOfMeasureCode,
    blocked: partData.partSummary?.blocked,
    active: partData.partSummary?.active,
  };

  return (
    <PartForm
      initialValues={initialValues}
      partGroups={sharedPartsData?.partGroups ?? []}
      partTypes={sharedPartsData?.partTypes ?? []}
      partReplenishmentSystems={sharedPartsData?.partReplenishmentSystems ?? []}
      unitOfMeasures={sharedPartsData?.unitOfMeasures ?? []}
    />
  );
}
