import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  CustomersTable,
  CustomersTableFilters,
} from "~/interfaces/Sales/Customers";
import { requirePermissions } from "~/services/auth";
import {
  getCustomers,
  getCustomerStatuses,
  getCustomerTypes,
} from "~/services/sales";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [customers, customerTypes, customerStatuses] = await Promise.all([
    getCustomers(client, { name, type, status, limit, offset, sorts, filters }),
    getCustomerTypes(client),
    getCustomerStatuses(client),
  ]);

  if (customers.error) {
    redirect(
      "/x",
      await flash(request, error(customers.error, "Failed to fetch customers"))
    );
  }

  return json({
    count: customers.count ?? 0,
    customers: customers.data ?? [],
    customerStatuses: customerStatuses.data ?? [],
    customerTypes: customerTypes.data ?? [],
  });
}

export default function SalesCustomersRoute() {
  const { count, customers, customerTypes, customerStatuses } =
    useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <CustomersTableFilters
        customerTypes={customerTypes}
        customerStatuses={customerStatuses}
      />
      <CustomersTable data={customers} count={count} />
      <Outlet />
    </VStack>
  );
}
