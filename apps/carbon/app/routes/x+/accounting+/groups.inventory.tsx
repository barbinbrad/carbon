import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { AccountListItem } from "~/modules/accounting";
import {
  InventoryPostingGroupsFilters,
  InventoryPostingGroupsTable,
  getInventoryPostingGroups,
} from "~/modules/accounting";
import { getPartGroupsList } from "~/modules/parts";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Inventory Groups",
  to: path.to.accountingGroupsInventory,
};

export async function loader({ request }: LoaderFunctionArgs) {
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
      path.to.accounting,
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

  const routeData = useRouteData<{
    balanceSheetAccounts: AccountListItem[];
    incomeStatementAccounts: AccountListItem[];
  }>(path.to.accounting);

  return (
    <VStack w="full" h="full" spacing={0}>
      <InventoryPostingGroupsFilters
        partGroups={partGroups}
        locations={locations}
      />
      <InventoryPostingGroupsTable
        data={data}
        count={count}
        partGroups={partGroups}
        locations={locations}
        balanceSheetAccounts={routeData?.balanceSheetAccounts ?? []}
        incomeStatementAccounts={routeData?.incomeStatementAccounts ?? []}
      />
      <Outlet />
    </VStack>
  );
}
