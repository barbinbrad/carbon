import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  EmployeeTypesTable,
  EmployeeTypesTableFilters,
} from "~/interfaces/Users/EmployeeTypes";
import { requirePermissions } from "~/services/auth";
import { getEmployeeTypes } from "~/services/users";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  return json(await getEmployeeTypes(client, { name, limit, offset, sorts }));
}

export default function EmployeeTypesRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <EmployeeTypesTableFilters />
      <EmployeeTypesTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </VStack>
  );
}
