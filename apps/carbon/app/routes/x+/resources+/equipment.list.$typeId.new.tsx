import { useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { EquipmentForm } from "~/interfaces/Resources/Equipment";
import type { EquipmentType } from "~/interfaces/Resources/types";

export default function NewEquipmentRoute() {
  const { typeId } = useParams();
  if (!typeId) throw new Error("typeId is not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const equipmentRouteData = useRouteData<{
    equipmentTypes: EquipmentType[];
  }>("/x/resources/equipment");

  return (
    <EquipmentForm
      initialValues={{
        name: "",
        description: "",
        operatorsRequired: 1,
        locationId: "",
        setupHours: 0,
        equipmentTypeId: typeId,
      }}
      equipmentTypes={equipmentRouteData?.equipmentTypes ?? []}
      onClose={onClose}
    />
  );
}
