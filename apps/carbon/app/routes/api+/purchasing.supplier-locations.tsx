import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getSupplierLocations } from "~/modules/purchasing";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const supplierId = searchParams.get("supplierId") as string;

  if (!supplierId || supplierId === "undefined")
    return json({
      data: [],
    });

  const locations = await getSupplierLocations(authorized.client, supplierId);
  if (locations.error) {
    return json(
      locations,
      await flash(
        request,
        error(locations.error, "Failed to get supplier locations")
      )
    );
  }

  return json(locations);
}
