import { useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { WorkCellForm } from "~/interfaces/Resources/WorkCells";
import type { WorkCellType } from "~/interfaces/Resources/types";

export default function NewWorkCellRoute() {
  const { typeId } = useParams();
  if (!typeId) throw new Error("typeId is not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const workCellRouteData = useRouteData<{
    workCellTypes: WorkCellType[];
  }>("/x/resources/work-cells");

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
