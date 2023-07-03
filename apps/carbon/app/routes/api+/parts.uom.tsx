import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getUnitOfMeasuresList } from "~/modules/parts";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {});

  return json(getUnitOfMeasuresList(authorized.client));
}
