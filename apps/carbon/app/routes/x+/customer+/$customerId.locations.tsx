import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CustomerLocations, getCustomerLocations } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { customerId } = params;
  if (!customerId) throw new Error("Could not find customerId");

  const locations = await getCustomerLocations(client, customerId);
  if (locations.error) {
    return redirect(
      path.to.customer(customerId),
      await flash(
        request,
        error(locations.error, "Failed to fetch customer locations")
      )
    );
  }

  return json({
    locations: locations.data ?? [],
  });
}

export default function CustomerLocationsRoute() {
  const { locations } = useLoaderData<typeof loader>();

  return <CustomerLocations locations={locations} />;
}
