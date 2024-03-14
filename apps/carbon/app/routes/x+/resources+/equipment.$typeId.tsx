import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  EquipmentTypeForm,
  equipmentTypeValidator,
  getEquipmentType,
  upsertEquipmentType,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid equipment type id");

  const equipmentType = await getEquipmentType(client, typeId);
  if (equipmentType.error) {
    return redirect(
      path.to.equipment,
      await flash(
        request,
        error(equipmentType.error, "Failed to fetch equipment type")
      )
    );
  }

  return json({ equipmentType: equipmentType.data });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await validator(equipmentTypeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("ID is was not found");

  const updateCategory = await upsertEquipmentType(client, {
    id,
    ...data,
    updatedBy: userId,
  });
  if (updateCategory.error) {
    return redirect(
      path.to.equipment,
      await flash(
        request,
        error(updateCategory.error, "Failed to update equipment type")
      )
    );
  }

  return redirect(
    path.to.equipment,
    await flash(request, success("Updated equipment type "))
  );
}

export default function EditAttributeCategoryRoute() {
  const { equipmentType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const onClose = () => navigate(path.to.equipment);

  const initialValues = {
    id: equipmentType?.id,
    name: equipmentType?.name ?? "",
    description: equipmentType?.description ?? "",
    requiredAbility: equipmentType?.requiredAbility ?? undefined,
    setupHours: equipmentType?.setupHours ?? 0,
  };

  return (
    <EquipmentTypeForm
      key={initialValues.id}
      onClose={onClose}
      initialValues={initialValues}
    />
  );
}
