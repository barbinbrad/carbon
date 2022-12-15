import { ActionMenu } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components/Data";
import { usePermissions } from "~/hooks";
import type { Employee, User } from "~/modules/Users/types";

type EmployeesTableProps = {
  data: Employee[];
  count: number;
  selectableRows?: boolean;
  onSelectedRowsChange?: (selectedRows: User[]) => void;
};

const EmployeesTable = memo(
  ({
    data,
    count,
    selectableRows = false,
    onSelectedRowsChange,
  }: EmployeesTableProps) => {
    const navigate = useNavigate();
    const permissions = usePermissions();

    const rows = data.map(({ user, employeeType }) => {
      if (
        user === null ||
        employeeType === null ||
        Array.isArray(user) ||
        Array.isArray(employeeType)
      ) {
        throw new Error("Expected user and employee type to be objects");
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        employeeType: employeeType.name,
      };
    });

    return (
      <Table<typeof rows[number]>
        data={rows}
        columns={[
          {
            accessorKey: "firstName",
            header: "First Name",
            cell: (item) => item.getValue(),
          },
          {
            accessorKey: "lastName",
            header: "Last Name",
            cell: (item) => item.getValue(),
          },
          {
            accessorKey: "email",
            header: "Email",
            cell: (item) => item.getValue(),
          },
          {
            accessorKey: "employeeType",
            header: "Employee Type",
            cell: (item) => item.getValue(),
          },
          {
            header: () => <VisuallyHidden>Actions</VisuallyHidden>,
            accessorKey: "id",
            cell: (item) => (
              <Flex justifyContent="end">
                {permissions.can("update", "users") && (
                  <ActionMenu>
                    <MenuItem
                      icon={<BsPencilSquare />}
                      onClick={() =>
                        navigate(`/app/users/employees/${item.getValue()}`)
                      }
                    >
                      Edit Employee
                    </MenuItem>
                    <MenuItem
                      icon={<IoMdTrash />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/app/users/employeess/deactivate/${item.getValue()}`
                        );
                      }}
                    >
                      Deactivate Employee
                    </MenuItem>
                  </ActionMenu>
                )}
              </Flex>
            ),
          },
        ]}
        count={count}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
      />
    );
  }
);

EmployeesTable.displayName = "EmployeeTable";

export default EmployeesTable;
