import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
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
import { getLocationsList } from "~/modules/resources";
import { getUserDefaults } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { ListItem } from "~/types";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let locationId = searchParams.get("location");

  if (!locationId) {
    const userDefaults = await getUserDefaults(client, userId);
    if (userDefaults.error) {
      return redirect(
        path.to.part(partId),
        await flash(
          request,
          error(userDefaults.error, "Failed to load default location")
        )
      );
    }

    locationId = userDefaults.data?.locationId ?? null;
  }

  if (!locationId) {
    const locations = await getLocationsList(client);
    if (locations.error || !locations.data?.length) {
      return redirect(
        path.to.part(partId),
        await flash(
          request,
          error(locations.error, "Failed to load any locations")
        )
      );
    }
    locationId = locations.data?.[0].id as string;
  }

  let partPlanning = await getPartPlanning(client, partId, locationId);

  if (partPlanning.error || !partPlanning.data) {
    const insertPartPlanning = await upsertPartPlanning(client, {
      partId,
      locationId,
      createdBy: userId,
    });

    if (insertPartPlanning.error) {
      return redirect(
        path.to.part(partId),
        await flash(
          request,
          error(insertPartPlanning.error, "Failed to insert part planning")
        )
      );
    }

    partPlanning = await getPartPlanning(client, partId, locationId);
    if (partPlanning.error || !partPlanning.data) {
      return redirect(
        path.to.part(partId),
        await flash(
          request,
          error(partPlanning.error, "Failed to load part planning")
        )
      );
    }
  }

  return json({
    partPlanning: partPlanning.data,
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
      path.to.part(partId),
      await flash(
        request,
        error(updatePartPlanning.error, "Failed to update part planning")
      )
    );
  }

  return redirect(
    path.to.partPlanningLocation(partId, validation.data.locationId),
    await flash(request, success("Updated part planning"))
  );
}

export default function PartPlanningRoute() {
  const sharedPartsData = useRouteData<{
    partReorderingPolicies: PartReorderingPolicy[];
    locations: ListItem[];
  }>(path.to.partRoot);

  const { partPlanning } = useLoaderData<typeof loader>();

  if (!sharedPartsData) throw new Error("Could not load shared parts data");

  return (
    <PartPlanningForm
      initialValues={partPlanning}
      locations={sharedPartsData.locations ?? []}
      partReorderingPolicies={sharedPartsData.partReorderingPolicies}
    />
  );
}
