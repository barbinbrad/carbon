import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteWorkCellType } from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { typeId } = params;
  if (!typeId) {
    return redirect(
      "/x/resources/work-cells",
      await flash(request, error(params, "Failed to get a work cell type id"))
    );
  }

  const deactivateWorkCellType = await deleteWorkCellType(client, typeId);
  if (deactivateWorkCellType.error) {
    return redirect(
      "/x/resources/work-cells",
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
    "/x/resources/work-cells",
    await flash(request, success("Successfully deactivated work cell type"))
  );
}
