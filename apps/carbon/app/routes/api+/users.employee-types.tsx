import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEmployeeTypes } from "~/modules/users";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  return json(await getEmployeeTypes(authorized.client));
}
