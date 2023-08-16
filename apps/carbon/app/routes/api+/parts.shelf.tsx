import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getShelvesList } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "parts",
  });

  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId");
  if (!locationId) {
    return json({
      data: [],
      error: null,
    });
  }

  return json(await getShelvesList(authorized.client, locationId));
}
