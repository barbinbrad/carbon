import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import { EquipmentTypeDetail } from "~/interfaces/Resources/Equipment";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getEquipmentType } from "~/services/resources";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid equipmentTypeId");

  const equipmentType = await getEquipmentType(client, typeId);
  if (equipmentType.error) {
    return redirect(
      "/x/resources/equipment",
      await flash(
        request,
        error(equipmentType.error, "Failed to fetch equipment")
      )
    );
  }

  return json({ equipmentType: equipmentType.data });
}

export default function EquipmentTypeListRoute() {
  const { equipmentType } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () => navigate(`/x/resources/equipment?${params.toString()}`);

  return (
    <>
      <EquipmentTypeDetail equipmentType={equipmentType} onClose={onClose} />
      <Outlet />
    </>
  );
}
