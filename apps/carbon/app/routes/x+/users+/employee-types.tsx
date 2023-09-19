import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  EmployeeTypesTable,
  EmployeeTypesTableFilters,
  getEmployeeTypes,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
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
