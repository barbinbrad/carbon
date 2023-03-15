import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getAbilitiesList } from "~/services/resources";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "resources",
  });

  return json(await getAbilitiesList(authorized.client));
}
