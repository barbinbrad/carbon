import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { workCellValidator, upsertWorkCell } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await workCellValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { workCellId } = params;
  if (!workCellId) {
    return redirect(
      "/x/resources/work-cells",
      await flash(
        request,
        error("No work cell id provided", "Failed to update work cell")
      )
    );
  }

  const updateWorkCell = await upsertWorkCell(client, {
    id: workCellId,
    ...validation.data,
    updatedBy: userId,
  });
  if (updateWorkCell.error)
    redirect(
      "/x/resources/work-cells/",
      await flash(
        request,
        error(updateWorkCell.error, "Failed to update work cell")
      )
    );

  return redirect(
    `/x/resources/work-cells/list/${validation.data.workCellTypeId}`,
    await flash(request, success("Successfully updated workCell"))
  );
}
