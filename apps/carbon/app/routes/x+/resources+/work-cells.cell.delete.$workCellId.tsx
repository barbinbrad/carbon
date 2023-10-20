import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteWorkCell, getWorkCell } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { workCellId } = params;
  if (!workCellId) throw new Error("No work cell id provided");

  const workCell = await getWorkCell(client, workCellId);
  if (workCell.error) {
    return redirect(
      path.to.workCells,
      await flash(request, error(workCell.error, "Failed to get work cell"))
    );
  }

  return json({
    workCell: workCell.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { workCellId } = params;
  if (!workCellId) throw new Error("No work cell id provided");

  const deactivateWorkCell = await deleteWorkCell(client, workCellId);
  if (deactivateWorkCell.error) {
    return redirect(
      path.to.workCells,
      await flash(
        request,
        error(deactivateWorkCell.error, "Failed to delete work cell")
      )
    );
  }

  return redirect(
    path.to.workCells,
    await flash(request, success("Successfully deleted work cell"))
  );
}

export default function DeleteWorkCellRoute() {
  const { workCell } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { workCellId } = useParams();
  if (!workCellId) return null;

  const onCancel = () => navigate(path.to.workCells);

  return (
    <ConfirmDelete
      action={`/x/resources/work-cells/cell/delete/${workCellId}`}
      name={workCell.name}
      text={`Are you sure you want remove delete ${workCell.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
