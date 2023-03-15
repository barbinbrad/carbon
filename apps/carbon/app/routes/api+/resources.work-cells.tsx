import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getWorkCellList } from "~/services/resources";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "resources",
  });

  const url = new URL(request.url);
  const location = url.searchParams.get("location");
  const workCellType = url.searchParams.get("workCellType");

  return json(await getWorkCellList(authorized.client, location, workCellType));
}
