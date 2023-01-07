import { ActionMenu } from "@carbon/react";
import {
  Flex,
  HStack,
  Input,
  MenuItem,
  Select,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { Employee } from "~/interfaces/Users/types";
import { BulkEditPermissionsForm } from "~/interfaces/Users/BulkEditPermissions";
import { Avatar } from "~/components";

type EmployeesTableProps = {
  data: Employee[];
  count: number;
  isEditable?: boolean;
};

const defaultColumnVisibility = {
  user_firstName: false,
  user_lastName: false,
};

const EmployeesTable = memo(
  ({ data, count, isEditable = false }: EmployeesTableProps) => {
    const navigate = useNavigate();
    const permissions = usePermissions();
    const bulkEditDrawer = useDisclosure();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const rows = useMemo(
      () =>
        data.map((d) => {
          // we should only have one user and employee per employee id
          if (
            d.user === null ||
            d.employeeType === null ||
            Array.isArray(d.user) ||
            Array.isArray(d.employeeType)
          ) {
            throw new Error("Expected user and employee type to be objects");
          }

          return d;
        }),
      [data]
    );

    const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
      return [
        {
          header: "User",
          cell: ({ row }) => (
            <HStack spacing={2}>
              <Avatar
                size="sm"
                // @ts-ignore
                name={row.original.user?.fullName}
                // @ts-ignore
                path={row.original.user?.avatarUrl}
              />

              <span>
                {
                  // @ts-ignore
                  `${row.original.user?.firstName} ${row.original.user?.lastName}`
                }
              </span>
            </HStack>
          ),
        },

        {
          accessorKey: "user.firstName",
          header: "First Name",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "user.lastName",
          header: "Last Name",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "user.email",
          header: "Email",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "employeeType.name",
          header: "Employee Type",
          cell: (item) => item.getValue(),
        },
        {
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          accessorKey: "user.id",
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
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const actions = useMemo(() => {
      return [
        {
          label: "Bulk Edit Permissions",
          disabled: !permissions.can("update", "users"),
          onClick: (selected: typeof rows) => {
            setSelectedUserIds(
              selected.reduce<string[]>((acc, row) => {
                if (row.user && !Array.isArray(row.user)) {
                  acc.push(row.user.id);
                }
                return acc;
              }, [])
            );
            bulkEditDrawer.onOpen();
          },
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <Table<typeof rows[number]>
          actions={actions}
          count={count}
          columns={columns}
          data={rows}
          defaultColumnVisibility={defaultColumnVisibility}
          editableComponents={{
            "user.firstName": EditableInput,
            "user.lastName": EditableInput,
            "user.email": EditableInput,
            "employeeType.name": EditableSelect,
          }}
          withColumnOrdering
          withFilters
          withInlineEditing={isEditable}
          withPagination
          withSelectableRows={isEditable}
        />
        {bulkEditDrawer.isOpen && (
          <BulkEditPermissionsForm
            userIds={selectedUserIds}
            isOpen={bulkEditDrawer.isOpen}
            onClose={bulkEditDrawer.onClose}
          />
        )}
      </>
    );
  }
);

// type EditableTableCellProps = {
//   value: unknown;
//   data: unknown;
//   accessorKey: string;
//   onUpdate: (value: unknown) => void;
// };

const EditableInput = ({ value, data, accessorKey, onUpdate }: any) => {
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <Input
      autoFocus
      defaultValue={value as string}
      onBlur={onBlur}
      border="none"
    />
  );
};

const EditableSelect = ({ value, data, accessorKey, onUpdate }: any) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(e.target.value);
  };

  return (
    <Select
      autoFocus
      defaultValue={value as string}
      onChange={onChange}
      border="none"
    >
      <option value="Admin">Admin</option>
      <option value="Project Manager">Project Manager</option>
      <option value="Sales">Sales</option>
    </Select>
  );
};

EmployeesTable.displayName = "EmployeeTable";

export default EmployeesTable;
