import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  PartsTable,
  PartsTableFilters,
  getParts,
  getPartGroupsList,
  getPartTypes,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const group = searchParams.get("group");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [parts, partTypes, partGroups] = await Promise.all([
    getParts(client, {
      search,
      type,
      group,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
    getPartTypes(),
    getPartGroupsList(client),
  ]);

  if (parts.error) {
    redirect(
      "/x",
      await flash(request, error(parts.error, "Failed to fetch parts"))
    );
  }

  return json({
    count: parts.count ?? 0,
    parts: parts.data ?? [],
    partGroups: partGroups.data ?? [],
    partTypes: partTypes ?? [],
  });
}

export default function PartsSearchRoute() {
  const { count, parts, partTypes, partGroups } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PartsTableFilters partTypes={partTypes} partGroups={partGroups} />
      <PartsTable data={parts} count={count} />
      <Outlet />
    </VStack>
  );
}
