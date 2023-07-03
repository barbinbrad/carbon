import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getDepartmentsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {});

  return json(await getDepartmentsList(authorized.client));
}
