import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  EquipmentTypeForm,
  equipmentTypeValidator,
  upsertEquipmentType,
} from "~/modules/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

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

  const { name, description, color, requiredAbility } = validation.data;

  const createEquipmentType = await upsertEquipmentType(client, {
    name,
    description,
    color,
    requiredAbility,
    createdBy: userId,
  });
  if (createEquipmentType.error) {
    return redirect(
      "/x/resources/equipment",
      await flash(
        request,
        error(createEquipmentType.error, "Failed to create equipment type")
      )
    );
  }

  return redirect(
    "/x/resources/equipment",
    await flash(request, success("Created equipment type "))
  );
}

export default function NewEquipmentTypeRoute() {
  const navigate = useNavigate();
  const onClose = () => navigate("/x/resources/equipment");

  const initialValues = {
    name: "",
    description: "",
    color: "#000000",
  };

  return <EquipmentTypeForm onClose={onClose} initialValues={initialValues} />;
}
