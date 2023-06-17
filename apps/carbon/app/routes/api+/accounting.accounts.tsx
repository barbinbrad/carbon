import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAccountsList } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "accounting",
  });

  return json(await getAccountsList(authorized.client));
}
