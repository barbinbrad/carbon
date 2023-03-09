import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import { EquipmentForm } from "~/interfaces/Resources/Equipment";
import type { EquipmentType } from "~/interfaces/Resources/types";
import { requirePermissions } from "~/services/auth";
import { getEquipment } from "~/services/resources";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId, equipmentId } = params;
  if (!equipmentId) throw notFound("equipmentId not found");

  const equipment = await getEquipment(client, equipmentId);
  if (equipment.error) {
    return redirect(
      `/x/resources/equipment/list/${typeId}`,
      await flash(request, error(equipment.error, "Failed to fetch equipment"))
    );
  }

  return json({
    equipment: equipment.data,
  });
}

export default function EditEquipmentRoute() {
  const { equipment } = useLoaderData<typeof loader>();
  const { typeId } = useParams();

  const navigate = useNavigate();
  const onClose = () => navigate(`/x/resources/equipment/list/${typeId}`);
  const equipmentRouteData = useRouteData<{
    equipmentTypes: EquipmentType[];
  }>("/x/resources/equipment");

  if (
    !equipment ||
    !typeId ||
    Array.isArray(equipment.equipmentType) ||
    Array.isArray(equipment.workCell)
  ) {
    return null;
  }

  return (
    <EquipmentForm
      initialValues={{
        id: equipment?.id,
        name: equipment?.name ?? "",
        description: equipment?.description ?? "",
        equipmentTypeId: equipment?.equipmentType?.id ?? typeId,
        operatorsRequired: equipment?.operatorsRequired ?? 1,
        setupHours: equipment?.setupHours ?? 0,
        workCellId: equipment?.workCell?.id,
      }}
      equipmentTypes={equipmentRouteData?.equipmentTypes ?? []}
      onClose={onClose}
    />
  );
}
