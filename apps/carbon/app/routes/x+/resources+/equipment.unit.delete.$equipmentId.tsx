import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { requirePermissions } from "~/services/auth";
import { deleteEquipment, getEquipment } from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { equipmentId } = params;
  if (!equipmentId) throw new Error("No equipment id provided");

  const equipment = await getEquipment(client, equipmentId);
  if (equipment.error) {
    return redirect(
      `/x/resources/equipment`,
      await flash(request, error(equipment.error, "Failed to get equipment"))
    );
  }

  return json({
    equipment: equipment.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { equipmentId } = params;
  if (!equipmentId) throw new Error("No equipment id provided");

  const deactivateEquipment = await deleteEquipment(client, equipmentId);
  if (deactivateEquipment.error) {
    return redirect(
      `/x/resources/equipment`,
      await flash(
        request,
        error(deactivateEquipment.error, "Failed to delete equipment")
      )
    );
  }

  return redirect(
    `/x/resources/equipment`,
    await flash(request, success("Successfully deleted equipment"))
  );
}

export default function DeleteEquipmentRoute() {
  const { equipment } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { equipmentId } = useParams();
  if (!equipmentId) return null;

  const onCancel = () => navigate("/x/resources/equipment");

  return (
    <ConfirmDelete
      action={`/x/resources/equipment/unit/delete/${equipmentId}`}
      name={equipment.name}
      text={`Are you sure you want remove delete ${equipment.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
