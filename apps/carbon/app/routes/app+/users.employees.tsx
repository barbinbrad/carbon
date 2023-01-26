import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  EmployeesTable,
  EmployeesTableFilters,
} from "~/interfaces/Users/Employees";
import { requirePermissions } from "~/services/auth";
import { getEmployees, getEmployeeTypes } from "~/services/users";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const active = searchParams.get("active") !== "false";

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [employees, employeeTypes] = await Promise.all([
    getEmployees(client, { name, type, active, limit, offset, sorts, filters }),
    getEmployeeTypes(client),
  ]);

  return json({ employees, employeeTypes });
}

export default function UsersEmployeesRoute() {
  const { employees, employeeTypes } = useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <VStack w="full" h="full" spacing={0}>
      <EmployeesTableFilters employeeTypes={employeeTypes.data ?? []} />
      <EmployeesTable
        data={employees.data ?? []}
        count={employees.count ?? 0}
        isEditable={permissions.can("update", "users")}
      />
      <Outlet />
    </VStack>
  );
}
