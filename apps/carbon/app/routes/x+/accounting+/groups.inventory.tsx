import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getInventoryPostingGroups,
  InventoryPostingGroupsFilters,
  InventoryPostingGroupsGrid,
} from "~/modules/accounting";
import { getPartGroupsList } from "~/modules/parts";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: ["accounting", "inventory"],
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const partGroup = searchParams.get("partGroup");
  const location = searchParams.get("location");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [inventoryGroups, partGroups, locations] = await Promise.all([
    getInventoryPostingGroups(client, {
      partGroup,
      location,
      limit,
      offset,
      sorts,
    }),
    getPartGroupsList(client),
    getLocationsList(client),
  ]);
  if (inventoryGroups.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(inventoryGroups.error, "Failed to fetch inventory posting groups")
      )
    );
  }

  return json({
    data: inventoryGroups.data ?? [],
    partGroups: partGroups.data ?? [],
    locations: locations.data ?? [],
    count: inventoryGroups.count ?? 0,
  });
}

export default function InventoryPostingGroupsRoute() {
  const { data, partGroups, locations, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <InventoryPostingGroupsFilters
        partGroups={partGroups}
        locations={locations}
      />
      <InventoryPostingGroupsGrid data={data} count={count} />
      <Outlet />
    </VStack>
  );
}
