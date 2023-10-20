import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  EquipmentTypeForm,
  equipmentTypeValidator,
  getEquipmentType,
  upsertEquipmentType,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
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

  const validation = await equipmentTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, color, description, requiredAbility } = validation.data;
  if (!id) throw new Error("ID is was not found");

  const updateCategory = await upsertEquipmentType(client, {
    id,
    name,
    color,
    description,
    requiredAbility,
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
    color: equipmentType?.color ?? "#000000",
    requiredAbility: equipmentType?.requiredAbility ?? undefined,
  };

  return <EquipmentTypeForm onClose={onClose} initialValues={initialValues} />;
}
