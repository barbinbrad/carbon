import { ActionMenu, Select, useColor } from "@carbon/react";
import { Button, HStack, MenuItem } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { EmployeesTable } from "~/modules/Users/Employees";
import type { User } from "~/modules/Users/types";
import { requirePermissions } from "~/services/auth";
import { getEmployees, getEmployeeTypes } from "~/services/users";
import { mapRowsToOptions } from "~/utils/form";
import { getPaginationParams } from "~/utils/http";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const { limit, offset } = getPaginationParams(searchParams);

  const [employees, employeeTypes] = await Promise.all([
    getEmployees(client, { name, type, limit, offset }),
    getEmployeeTypes(client),
  ]);

  return json({ employees, employeeTypes });
}

export default function UsersEmployeesRoute() {
  const { employees, employeeTypes } = useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const employeeTypeOptions = mapRowsToOptions({
    data: employeeTypes.data,
    value: "id",
    label: "name",
  });

  const borderColor = useColor("gray.200");

  return (
    <>
      <HStack
        px={4}
        py={3}
        justifyContent="space-between"
        borderBottomColor={borderColor}
        borderBottomStyle="solid"
        borderBottomWidth={1}
      >
        <HStack spacing={2}>
          {permissions.can("update", "users") && (
            <ActionMenu
              icon={<BsCheckSquare />}
              disabled={selectedRows.length === 0}
            >
              <MenuItem disabled={selectedRows.length === 0}>
                Bulk Edit Permissions
              </MenuItem>
            </ActionMenu>
          )}
          <DebouncedInput
            param="name"
            size="sm"
            minW={180}
            placeholder="Search by name"
          />
          <Select
            // @ts-ignore
            size="sm"
            colorScheme="brand"
            defaultValue={employeeTypeOptions.filter(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={employeeTypeOptions}
            onChange={(selected) => {
              setParams({ type: selected?.value });
            }}
            aria-label="Employee Type"
            minW={180}
            placeholder="Employee Type"
          />
        </HStack>
        <HStack spacing={2}>
          {permissions.can("create", "users") && (
            <Button
              colorScheme="brand"
              onClick={() => {
                navigate("new");
              }}
              leftIcon={<IoMdAdd />}
            >
              New Employee
            </Button>
          )}
        </HStack>
      </HStack>
      <EmployeesTable
        data={employees.data ?? []}
        count={employees.count ?? 0}
        selectableRows={permissions.can("update", "users")}
        onSelectedRowsChange={setSelectedRows}
      />

      <Outlet />
    </>
  );
}
