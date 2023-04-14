import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { PartReorderingPolicy } from "~/modules/parts";
import {
  getPartPlanning,
  PartPlanningForm,
  partPlanningValidator,
  upsertPartPlanning,
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

  const partPlanning = await getPartPlanning(client, partId);

  if (partPlanning.error) {
    return redirect(
      "/x/parts",
      await flash(
        request,
        error(partPlanning.error, "Failed to load part planning")
      )
    );
  }

  return json({
    partPlanning: partPlanning.data,
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
  const validation = await partPlanningValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartPlanning = await upsertPartPlanning(client, {
    ...validation.data,
    partId,
    updatedBy: userId,
  });
  if (updatePartPlanning.error) {
    return redirect(
      `/x/part/${partId}`,
      await flash(
        request,
        error(updatePartPlanning.error, "Failed to update part planning")
      )
    );
  }

  return redirect(
    `/x/part/${partId}/planning`,
    await flash(request, success("Updated part planning"))
  );
}

export default function PartPlanningRoute() {
  const sharedPartsData = useRouteData<{
    partReorderingPolicies: PartReorderingPolicy[];
  }>("/x/part");

  const { partPlanning } = useLoaderData<typeof loader>();

  if (!sharedPartsData) throw new Error("Could not load shared parts data");
  return (
    <PartPlanningForm
      initialValues={partPlanning}
      partReorderingPolicies={sharedPartsData.partReorderingPolicies}
    />
  );
}
