import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getCustomersList } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "sales",
  });

  return json(await getCustomersList(authorized.client));
}
