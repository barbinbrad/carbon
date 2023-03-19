import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  WorkCellTypesTable,
  WorkCellTypesTableFilters,
  getWorkCellTypes,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
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

  const workCellTypes = await getWorkCellTypes(client, {
    name,
    limit,
    offset,
    sorts,
  });

  if (workCellTypes.error) {
    redirect(
      "/x",
      await flash(
        request,
        error(workCellTypes.error, "Failed to fetch equipment types")
      )
    );
  }

  return json({
    count: workCellTypes.count ?? 0,
    workCellTypes: workCellTypes.data ?? [],
  });
}

export default function UserAttributesRoute() {
  const { count, workCellTypes } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <WorkCellTypesTableFilters />
      <WorkCellTypesTable data={workCellTypes} count={count} />
      <Outlet />
    </VStack>
  );
}
