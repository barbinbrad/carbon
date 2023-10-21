import { useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { WorkCellType } from "~/modules/resources";
import { WorkCellForm } from "~/modules/resources";
import { path } from "~/utils/path";

export default function NewWorkCellRoute() {
  const { typeId } = useParams();
  if (!typeId) throw new Error("typeId not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const workCellRouteData = useRouteData<{
    workCellTypes: WorkCellType[];
  }>(path.to.workCells);

  return (
    <WorkCellForm
      initialValues={{
        name: "",
        description: "",
        locationId: "",
        departmentId: "",
        workCellTypeId: typeId,
      }}
      workCellTypes={workCellRouteData?.workCellTypes ?? []}
      onClose={onClose}
    />
  );
}
