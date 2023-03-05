import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getCustomersList } from "~/services/sales";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "sales",
  });

  return json(await getCustomersList(authorized.client));
}
