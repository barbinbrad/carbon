import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getSuppliersList } from "~/services/purchasing";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "purchasing",
  });

  return json(await getSuppliersList(authorized.client));
}
