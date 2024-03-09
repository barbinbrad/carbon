import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { upsertWorkCell, workCellValidator } from "~/modules/resources";
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

  const validation = await validator(workCellValidator).validate(
    await request.formData()
  );

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

  return redirect(path.to.workCells);
}
