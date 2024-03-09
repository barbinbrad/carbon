import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { equipmentValidator, upsertEquipment } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(equipmentValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertEquipment = await upsertEquipment(client, {
    ...data,
    createdBy: userId,
  });
  if (insertEquipment.error) {
    return json(
      {},
      await flash(
        request,
        error(insertEquipment.error, "Failed to create equipment")
      )
    );
  }

  return redirect(path.to.equipment);
}
