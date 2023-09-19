import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { AccountListItem } from "~/modules/accounting";
import {
  getSalesPostingGroups,
  SalesPostingGroupsFilters,
  SalesPostingGroupsTable,
} from "~/modules/accounting";
import { getPartGroupsList } from "~/modules/parts";
import { getCustomerTypesList } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: ["accounting", "sales"],
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const partGroup = searchParams.get("partGroup");
  const customerType = searchParams.get("customerType");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [salesGroups, partGroups, customerTypes] = await Promise.all([
    getSalesPostingGroups(client, {
      partGroup,
      customerType,
      limit,
      offset,
      sorts,
    }),
    getPartGroupsList(client),
    getCustomerTypesList(client),
  ]);
  if (salesGroups.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(salesGroups.error, "Failed to fetch sales posting groups")
      )
    );
  }

  return json({
    data: salesGroups.data ?? [],
    count: salesGroups.count ?? 0,
    partGroups: partGroups.data ?? [],
    customerTypes: customerTypes.data ?? [],
  });
}

export default function SalesPostingGroupsRoute() {
  const { data, count, partGroups, customerTypes } =
    useLoaderData<typeof loader>();

  const routeData = useRouteData<{
    balanceSheetAccounts: AccountListItem[];
    incomeStatementAccounts: AccountListItem[];
  }>("/x/accounting");

  return (
    <VStack w="full" h="full" spacing={0}>
      <SalesPostingGroupsFilters
        partGroups={partGroups}
        customerTypes={customerTypes}
      />
      <SalesPostingGroupsTable
        data={data}
        count={count}
        partGroups={partGroups}
        customerTypes={customerTypes}
        balanceSheetAccounts={routeData?.balanceSheetAccounts ?? []}
        incomeStatementAccounts={routeData?.incomeStatementAccounts ?? []}
      />
      <Outlet />
    </VStack>
  );
}
