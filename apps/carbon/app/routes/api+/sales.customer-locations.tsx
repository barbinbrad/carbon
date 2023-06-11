import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { getCustomerLocations } from "~/modules/sales";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "sales",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const customerId = searchParams.get("customerId") as string;

  if (!customerId || customerId === "undefined")
    return json({
      data: [],
    });

  const locations = await getCustomerLocations(authorized.client, customerId);
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
