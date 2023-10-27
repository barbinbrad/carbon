import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { arrayToTree } from "performant-array-to-tree";
import type { Group } from "~/modules/users";
import { GroupsTable, GroupsTableFilters, getGroups } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Groups",
  to: path.to.groups,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const uid = searchParams.get("uid");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const groups = await getGroups(client, { name, uid, limit, offset, sorts });

  if (groups.error) {
    return json(
      { groups: [], count: 0, error: groups.error },
      await flash(request, error(groups.error, "Failed to load groups"))
    );
  }

  return json({
    groups: (groups.data ? arrayToTree(groups.data) : []) as Group[],
    error: null,
    count: groups.count ?? 0,
  });
}

export default function GroupsRoute() {
  const { groups, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <GroupsTableFilters />
      {/* @ts-ignore */}
      <GroupsTable data={groups} count={count} />
      <Outlet />
    </VStack>
  );
}
