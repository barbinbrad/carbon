import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  LocationsTable,
  LocationsTableFilters,
} from "~/interfaces/Resources/Locations";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getLocations } from "~/services/resources";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const locations = await getLocations(client, { name, limit, offset, sorts });

  if (locations.error) {
    return redirect(
      "/x/resources",
      await flash(request, error(locations.error, "Failed to load locations"))
    );
  }

  return json({
    locations: locations.data ?? [],
    count: locations.count ?? 0,
  });
}

export default function LocationsRoute() {
  const { locations, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <LocationsTableFilters />
      <LocationsTable data={locations} count={count} />
      <Outlet />
    </VStack>
  );
}
