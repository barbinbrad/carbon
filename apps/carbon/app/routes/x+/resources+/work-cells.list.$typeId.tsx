import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import { getWorkCellType, WorkCellTypeDetail } from "~/modules/resources";
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

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid workCellTypeId");

  const workCellType = await getWorkCellType(client, typeId);
  if (workCellType.error) {
    return redirect(
      path.to.workCells,
      await flash(
        request,
        error(workCellType.error, "Failed to fetch work cell type")
      )
    );
  }

  return json({ workCellType: workCellType.data });
}

export default function WorkCellTypeListRoute() {
  const { workCellType } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () => navigate(`${path.to.workCells}?${params.toString()}`);

  return (
    <>
      <WorkCellTypeDetail workCellType={workCellType} onClose={onClose} />
      <Outlet />
    </>
  );
}
