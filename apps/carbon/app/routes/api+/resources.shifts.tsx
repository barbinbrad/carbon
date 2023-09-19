import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getShiftsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {});

  const url = new URL(request.url);
  const location = url.searchParams.get("location");

  return json(await getShiftsList(authorized.client, location));
}
