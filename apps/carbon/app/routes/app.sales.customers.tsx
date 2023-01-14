import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  CustomersTable,
  CustomersTableFilters,
} from "~/interfaces/Sales/Customers";
import { requirePermissions } from "~/services/auth";
import { getCustomers, getCustomerTypes } from "~/services/sales";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const active = searchParams.get("active") !== "false";

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [customers, customerTypes] = await Promise.all([
    getCustomers(client, { name, type, active, limit, offset, sorts, filters }),
    getCustomerTypes(client),
  ]);

  return json({ customers, customerTypes });
}

export default function SalesCustomersRoute() {
  const { customers, customerTypes } = useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <VStack w="full" h="full" spacing={0}>
      <CustomersTableFilters customerTypes={customerTypes.data ?? []} />
      <CustomersTable
        data={customers.data ?? []}
        count={customers.count ?? 0}
      />
      <Outlet />
    </VStack>
  );
}
