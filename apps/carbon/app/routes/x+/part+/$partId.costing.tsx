import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import { getAccountsList } from "~/modules/accounting";
import type { PartCostingMethod } from "~/modules/parts";
import {
  getPartCost,
  PartCostingForm,
  partCostValidator,
  upsertPartCost,
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

  const [partCost, accounts] = await Promise.all([
    getPartCost(client, partId),
    getAccountsList(client),
  ]);

  if (partCost.error) {
    return redirect(
      path.to.parts,
      await flash(request, error(partCost.error, "Failed to load part costing"))
    );
  }
  if (accounts.error) {
    return redirect(
      path.to.parts,
      await flash(request, error(accounts.error, "Failed to load accounts"))
    );
  }

  return json({
    partCost: partCost.data,
    accounts: accounts.data,
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
  const validation = await partCostValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartCost = await upsertPartCost(client, {
    ...validation.data,
    partId,
    updatedBy: userId,
  });
  if (updatePartCost.error) {
    return redirect(
      path.to.part(partId),
      await flash(
        request,
        error(updatePartCost.error, "Failed to update part costing")
      )
    );
  }

  return redirect(
    path.to.partCosting(partId),
    await flash(request, success("Updated part costing"))
  );
}

export default function PartCostingRoute() {
  const sharedPartsData = useRouteData<{
    partCostingMethods: PartCostingMethod[];
  }>(path.to.partRoot);

  const { partCost } = useLoaderData<typeof loader>();
  return (
    <PartCostingForm
      initialValues={partCost}
      partCostingMethods={sharedPartsData?.partCostingMethods ?? []}
    />
  );
}
