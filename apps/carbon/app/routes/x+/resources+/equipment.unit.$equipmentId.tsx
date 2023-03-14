import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { equipmentValidator, upsertEquipment } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await equipmentValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { equipmentId } = params;
  if (!equipmentId) {
    return redirect(
      "/x/resources/equipment",
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
      "/x/resources/equipment/",
      await flash(
        request,
        error(updateEquipment.error, "Failed to update equipment")
      )
    );

  return redirect(
    `/x/resources/equipment/list/${validation.data.equipmentTypeId}`,
    await flash(request, success("Successfully updated equipment"))
  );
}
