import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  EmployeesTable,
  EmployeesTableFilters,
} from "~/interfaces/Users/Employees";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getEmployees, getEmployeeTypes } from "~/services/users";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

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

  if (employees.error) {
    return redirect(
      "/x",
      await flash(request, error(employees.error, "Error loading employees"))
    );
  }
  if (employeeTypes.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(employeeTypes.error, "Error loading employee types")
      )
    );
  }

  return json({
    count: employees.count ?? 0,
    employees: employees.data,
    employeeTypes: employeeTypes.data,
  });
}

export default function UsersEmployeesRoute() {
  const { count, employees, employeeTypes } = useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <VStack w="full" h="full" spacing={0}>
      <EmployeesTableFilters employeeTypes={employeeTypes} />
      <EmployeesTable
        data={employees}
        count={count}
        isEditable={permissions.can("update", "users")}
      />
      <Outlet />
    </VStack>
  );
}