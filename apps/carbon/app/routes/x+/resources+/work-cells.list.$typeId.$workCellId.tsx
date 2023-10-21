import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { WorkCellType } from "~/modules/resources";
import { getWorkCell, WorkCellForm } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId, workCellId } = params;
  if (!typeId) throw notFound("typeId not found");
  if (!workCellId) throw notFound("workCellId not found");

  const workCell = await getWorkCell(client, workCellId);
  if (workCell.error) {
    return redirect(
      path.to.workCellTypeList(typeId),
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
  if (!typeId) throw new Error("typeId not found");

  const navigate = useNavigate();
  const onClose = () => navigate(path.to.workCellTypeList(typeId));
  const workCellRouteData = useRouteData<{
    workCellTypes: WorkCellType[];
  }>(path.to.workCells);

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
