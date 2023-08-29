import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getPurchasingPostingGroups,
  PurchasingPostingGroupsFilters,
  PurchasingPostingGroupsGrid,
} from "~/modules/accounting";
import { getPartGroupsList } from "~/modules/parts";
import { getSupplierTypesList } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: ["accounting", "purchasing"],
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const partGroup = searchParams.get("partGroup");
  const supplierType = searchParams.get("supplierType");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [purchasingGroups, partGroups, supplierTypes] = await Promise.all([
    getPurchasingPostingGroups(client, {
      partGroup,
      supplierType,
      limit,
      offset,
      sorts,
    }),
    getPartGroupsList(client),
    getSupplierTypesList(client),
  ]);
  if (purchasingGroups.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(
          purchasingGroups.error,
          "Failed to fetch purchasing posting groups"
        )
      )
    );
  }

  return json({
    data: purchasingGroups.data ?? [],
    partGroups: partGroups.data ?? [],
    supplierTypes: supplierTypes.data ?? [],
    count: purchasingGroups.count ?? 0,
  });
}

export default function PurchasingPostingGroupsRoute() {
  const { data, partGroups, supplierTypes, count } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PurchasingPostingGroupsFilters
        partGroups={partGroups}
        supplierTypes={supplierTypes}
      />
      <PurchasingPostingGroupsGrid data={data} count={count} />
      <Outlet />
    </VStack>
  );
}
