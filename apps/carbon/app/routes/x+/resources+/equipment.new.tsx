import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  EquipmentTypeForm,
  equipmentTypeValidator,
  upsertEquipmentType,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(equipmentTypeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createEquipmentType = await upsertEquipmentType(client, {
    ...data,
    createdBy: userId,
  });
  if (createEquipmentType.error) {
    return modal
      ? json(createEquipmentType)
      : redirect(
          path.to.equipment,
          await flash(
            request,
            error(createEquipmentType.error, "Failed to create equipment type")
          )
        );
  }

  return modal
    ? json(createEquipmentType, { status: 201 })
    : redirect(path.to.equipment);
}

export default function NewEquipmentTypeRoute() {
  const navigate = useNavigate();
  const onClose = () => navigate(path.to.equipment);

  const initialValues = {
    name: "",
    description: "",
    setupHours: 0,
  };

  return <EquipmentTypeForm onClose={onClose} initialValues={initialValues} />;
}
