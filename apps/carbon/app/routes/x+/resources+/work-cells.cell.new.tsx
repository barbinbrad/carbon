import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { workCellValidator, upsertWorkCell } from "~/services/resources";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await workCellValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    name,
    description,
    workCellTypeId,
    locationId,
    departmentId,
    activeDate,
  } = validation.data;

  const insertWorkCell = await upsertWorkCell(client, {
    name,
    description,
    workCellTypeId,
    locationId,
    departmentId,
    activeDate,
    createdBy: userId,
  });
  if (insertWorkCell.error) {
    return json(
      {},
      await flash(
        request,
        error(insertWorkCell.error, "Failed to create work cell")
      )
    );
  }

  return redirect(
    `/x/resources/work-cells`,
    await flash(request, success("Created workCell"))
  );
}
