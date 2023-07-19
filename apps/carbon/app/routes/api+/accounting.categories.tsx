import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAccountCategoriesList } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {});

  return json(await getAccountCategoriesList(authorized.client));
}
