import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { WorkCellForm } from "~/interfaces/Resources/WorkCells";
import type { WorkCellType } from "~/interfaces/Resources/types";
import { requirePermissions } from "~/services/auth";
import { getWorkCell } from "~/services/resources";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId, workCellId } = params;
  if (!workCellId) throw notFound("workCellId not found");

  const workCell = await getWorkCell(client, workCellId);
  if (workCell.error) {
    return redirect(
      `/x/resources/work-cells/list/${typeId}`,
      await flash(request, error(workCell.error, "Failed to fetch work cell"))
    );
  }

  return json({
    workCell: workCell.data,
  });
}

export default function EditWorkCellRoute() {
  const { workCell } = useLoaderData<typeof loader>();
  const { typeId } = useParams();

  const navigate = useNavigate();
  const onClose = () => navigate(`/x/resources/work-cells/list/${typeId}`);
  const workCellRouteData = useRouteData<{
    workCellTypes: WorkCellType[];
  }>("/x/resources/work-cells");

  if (
    !workCell ||
    !typeId ||
    Array.isArray(workCell.workCellType) ||
    Array.isArray(workCell.location) ||
    Array.isArray(workCell.department)
  ) {
    return null;
  }

  return (
    <WorkCellForm
      initialValues={{
        id: workCell?.id,
        name: workCell?.name ?? "",
        description: workCell?.description ?? "",
        workCellTypeId: workCell?.workCellType?.id ?? typeId,
        locationId: workCell?.location?.id ?? "",
        departmentId: workCell?.department?.id ?? "",
        activeDate: workCell?.activeDate ?? "",
      }}
      workCellTypes={workCellRouteData?.workCellTypes ?? []}
      onClose={onClose}
    />
  );
}
