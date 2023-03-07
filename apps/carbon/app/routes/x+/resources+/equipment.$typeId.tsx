import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { EquipmentTypeForm } from "~/interfaces/Resources/Equipment";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  equipmentTypeValidator,
  getEquipmentType,
  upsertEquipmentType,
} from "~/services/resources";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid equipment type id");

  const equipmentType = await getEquipmentType(client, typeId);
  if (equipmentType.error) {
    return redirect(
      "/x/resources/equipment",
      await flash(
        request,
        error(equipmentType.error, "Failed to fetch equipment type")
      )
    );
  }

  return json({ equipmentType: equipmentType.data });
}

export async function action({ request }: ActionArgs) {
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

  const { id, name, color, description } = validation.data;
  if (!id) throw new Error("ID is was not found");

  const updateCategory = await upsertEquipmentType(client, {
    id,
    name,
    color,
    description,
    updatedBy: userId,
  });
  if (updateCategory.error) {
    return redirect(
      "/x/resources/equipment",
      await flash(
        request,
        error(updateCategory.error, "Failed to update equipment type")
      )
    );
  }

  return redirect(
    "/x/resources/equipment",
    await flash(request, success("Updated equipment type "))
  );
}

export default function EditAttributeCategoryRoute() {
  const { equipmentType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/resources/equipment/");

  const initialValues = {
    id: equipmentType?.id,
    name: equipmentType?.name ?? "",
    description: equipmentType?.description ?? "",
    color: equipmentType?.color ?? "#000000",
  };

  return <EquipmentTypeForm onClose={onClose} initialValues={initialValues} />;
}
