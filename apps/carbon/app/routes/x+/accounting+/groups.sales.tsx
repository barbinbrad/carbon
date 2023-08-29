import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getSalesPostingGroups,
  SalesPostingGroupsFilters,
  SalesPostingGroupsGrid,
} from "~/modules/accounting";
import { getPartGroupsList } from "~/modules/parts";
import { getCustomerTypesList } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
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
    partGroups: partGroups.data ?? [],
    customerTypes: customerTypes.data ?? [],
    count: salesGroups.count ?? 0,
  });
}

export default function SalesPostingGroupsRoute() {
  const { data, partGroups, customerTypes, count } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SalesPostingGroupsFilters
        partGroups={partGroups}
        customerTypes={customerTypes}
      />
      <SalesPostingGroupsGrid data={data} count={count} />
      <Outlet />
    </VStack>
  );
}
