import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  PartGroupForm,
  getPartGroup,
  partGroupValidator,
  upsertPartGroup,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const partGroup = await getPartGroup(client, groupId);

  return json({
    partGroup: partGroup?.data ?? null,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { groupId } = params;
  if (!groupId) throw new Error("Could not find groupId");

  const validation = await validator(partGroupValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartGroup = await upsertPartGroup(client, {
    id: groupId,
    ...validation.data,
    updatedBy: userId,
  });

  if (updatePartGroup.error) {
    return json(
      {},
      await flash(
        request,
        error(updatePartGroup.error, "Failed to update part group")
      )
    );
  }

  return redirect(
    path.to.partGroups,
    await flash(request, success("Updated part group"))
  );
}

export default function EditPartGroupsRoute() {
  const { partGroup } = useLoaderData<typeof loader>();

  const initialValues = {
    id: partGroup?.id ?? undefined,
    name: partGroup?.name ?? "",
    description: partGroup?.description ?? "",
  };

  return <PartGroupForm key={initialValues.id} initialValues={initialValues} />;
}
