import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEmployeeTypes } from "~/services/users";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  return json(await getEmployeeTypes(client));
}
