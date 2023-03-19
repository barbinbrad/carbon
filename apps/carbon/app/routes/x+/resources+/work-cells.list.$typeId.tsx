import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import { WorkCellTypeDetail, getWorkCellType } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid workCellTypeId");

  const workCellType = await getWorkCellType(client, typeId);
  if (workCellType.error) {
    return redirect(
      "/x/resources/work-cells",
      await flash(
        request,
        error(workCellType.error, "Failed to fetch work cell")
      )
    );
  }

  return json({ workCellType: workCellType.data });
}

export default function WorkCellTypeListRoute() {
  const { workCellType } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () =>
    navigate(`/x/resources/work-cells?${params.toString()}`);

  return (
    <>
      <WorkCellTypeDetail workCellType={workCellType} onClose={onClose} />
      <Outlet />
    </>
  );
}
