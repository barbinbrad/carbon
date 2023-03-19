import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  SupplierTypesTable,
  SupplierTypesTableFilters,
  getSupplierTypes,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  return json(await getSupplierTypes(client, { name, limit, offset, sorts }));
}

export default function SupplierTypesRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <SupplierTypesTableFilters />
      <SupplierTypesTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
