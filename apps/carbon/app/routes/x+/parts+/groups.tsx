import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getAccountsList } from "~/modules/accounting";
import {
  getPartGroups,
  PartGroupsTable,
  PartGroupsTableFilters,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [partGroups, accounts] = await Promise.all([
    getPartGroups(client, {
      limit,
      offset,
      sorts,
      name,
    }),
    getAccountsList(client),
  ]);

  if (partGroups.error) {
    return redirect(
      "/x/parts",
      await flash(request, error(null, "Error loading part groups"))
    );
  }

  if (accounts.error) {
    return redirect(
      "/x/parts/groups",
      await flash(request, error(accounts.error, "Error loading accounts"))
    );
  }

  return json({
    partGroups: partGroups.data ?? [],
    count: partGroups.count ?? 0,
    accounts: accounts.data ?? [],
  });
}

export default function PartGroupsRoute() {
  const { partGroups, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PartGroupsTableFilters />
      <PartGroupsTable data={partGroups} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
