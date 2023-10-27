import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getAccountsList } from "~/modules/accounting";
import {
  PartGroupsTable,
  PartGroupsTableFilters,
  getPartGroups,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Part Groups",
  to: path.to.partGroups,
};

export async function loader({ request }: LoaderFunctionArgs) {
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
      path.to.parts,
      await flash(request, error(null, "Error loading part groups"))
    );
  }

  if (accounts.error) {
    return redirect(
      path.to.partGroups,
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
