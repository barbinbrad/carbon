import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { SupplierLocations, getSupplierLocations } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const locations = await getSupplierLocations(client, supplierId);
  if (locations.error) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(locations.error, "Failed to fetch supplier locations")
      )
    );
  }

  return json({
    locations: locations.data ?? [],
  });
}

export default function SupplierLocationsRoute() {
  const { locations } = useLoaderData<typeof loader>();

  return <SupplierLocations locations={locations} />;
}
