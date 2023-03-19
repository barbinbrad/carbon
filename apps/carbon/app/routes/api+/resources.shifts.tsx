import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getShiftsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "resources",
  });

  const url = new URL(request.url);
  const location = url.searchParams.get("location");

  return json(await getShiftsList(authorized.client, location));
}
