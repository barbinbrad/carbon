import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { equipmentValidator, upsertEquipment } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await validator(equipmentValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { equipmentId } = params;
  if (!equipmentId) {
    return redirect(
      path.to.equipment,
      await flash(
        request,
        error("No equipment id provided", "Failed to update equipment")
      )
    );
  }

  const updateEquipment = await upsertEquipment(client, {
    id: equipmentId,
    ...validation.data,
    updatedBy: userId,
  });
  if (updateEquipment.error)
    redirect(
      path.to.equipment,
      await flash(
        request,
        error(updateEquipment.error, "Failed to update equipment")
      )
    );

  return redirect(
    path.to.equipmentTypeList(validation.data.equipmentTypeId),
    await flash(request, success("Successfully updated equipment"))
  );
}
