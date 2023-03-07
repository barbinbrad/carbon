import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { equipmentValidator, upsertEquipment } from "~/services/resources";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await equipmentValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, description, equipmentTypeId, operatorsRequired, workCellId } =
    validation.data;

  const insertEquipment = await upsertEquipment(client, {
    name,
    description,
    equipmentTypeId,
    operatorsRequired,
    workCellId,
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

  return redirect(
    `/x/resources/equipment`,
    await flash(request, success("Created equipment"))
  );
}
