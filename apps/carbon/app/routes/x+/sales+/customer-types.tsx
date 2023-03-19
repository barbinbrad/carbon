import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  CustomerTypesTable,
  CustomerTypesTableFilters,
  getCustomerTypes,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  return json(await getCustomerTypes(client, { name, limit, offset, sorts }));
}

export default function CustomerTypesRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <CustomerTypesTableFilters />
      <CustomerTypesTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
