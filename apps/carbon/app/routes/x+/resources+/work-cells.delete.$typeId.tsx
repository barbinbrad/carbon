import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteWorkCellType } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { typeId } = params;
  if (!typeId) {
    return redirect(
      path.to.workCells,
      await flash(request, error(params, "Failed to get a work cell type id"))
    );
  }

  const deactivateWorkCellType = await deleteWorkCellType(client, typeId);
  if (deactivateWorkCellType.error) {
    return redirect(
      path.to.workCells,
      await flash(
        request,
        error(
          deactivateWorkCellType.error,
          "Failed to deactivate work cell type"
        )
      )
    );
  }

  return redirect(
    path.to.workCells,
    await flash(request, success("Successfully deactivated work cell type"))
  );
}
