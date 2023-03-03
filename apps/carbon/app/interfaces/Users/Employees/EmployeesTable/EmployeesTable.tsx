import { ActionMenu } from "@carbon/react";
import {
  Flex,
  HStack,
  MenuItem,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsEnvelope, BsPencilSquare, BsShieldLock } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Employee } from "~/interfaces/Users/types";
import { BulkEditPermissionsForm } from "~/interfaces/Users/Employees";
import { ResendInviteModal, DeactivateUsersModal } from "~/interfaces/Users";
import { FaBan } from "react-icons/fa";
import { useRealtime } from "~/hooks/useRealtime";

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
    useRealtime(["user"]);

    const navigate = useNavigate();
    const permissions = usePermissions();
    const [params] = useUrlParams();

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const bulkEditDrawer = useDisclosure();
    const deactivateEmployeeModal = useDisclosure();
    const resendInviteModal = useDisclosure();

    const rows = useMemo(
      () =>
        data.map((d) => {
          // we should have one user and employee per employee id
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
                      navigate(
                        `/x/users/employees/${
                          item.getValue() as string
                        }?${params.toString()}`
                      )
                    }
                  >
                    Edit Employee
                  </MenuItem>
                  <MenuItem
                    icon={<BsEnvelope />}
                    onClick={() => {
                      setSelectedUserIds([item.getValue() as string]);
                      resendInviteModal.onOpen();
                    }}
                  >
                    Send Account Invite
                  </MenuItem>
                  {
                    // @ts-ignore
                    item.row.original.user?.active === true && (
                      <MenuItem
                        icon={<IoMdTrash />}
                        onClick={(e) => {
                          setSelectedUserIds([item.getValue() as string]);
                          deactivateEmployeeModal.onOpen();
                        }}
                      >
                        Deactivate Employee
                      </MenuItem>
                    )
                  }
                </ActionMenu>
              )}
            </Flex>
          ),
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const actions = useMemo(() => {
      return [
        {
          label: "Bulk Edit Permissions",
          icon: <BsShieldLock />,
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
        {
          label: "Send Account Invite",
          icon: <BsEnvelope />,
          disabled: !permissions.can("create", "users"),
          onClick: (selected: typeof rows) => {
            setSelectedUserIds(
              selected.reduce<string[]>((acc, row) => {
                if (row.user && !Array.isArray(row.user)) {
                  acc.push(row.user.id);
                }
                return acc;
              }, [])
            );
            resendInviteModal.onOpen();
          },
        },
        {
          label: "Deactivate Users",
          icon: <FaBan />,
          disabled: !permissions.can("delete", "users"),
          onClick: (selected: typeof rows) => {
            setSelectedUserIds(
              selected.reduce<string[]>((acc, row) => {
                if (row.user && !Array.isArray(row.user)) {
                  acc.push(row.user.id);
                }
                return acc;
              }, [])
            );
            deactivateEmployeeModal.onOpen();
          },
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const editableComponents = useMemo(
    //   () => ({
    //     "user.firstName": EditableName,
    //     "user.lastName": EditableName,
    //   }),
    //   []
    // );

    return (
      <>
        <Table<typeof rows[number]>
          actions={actions}
          count={count}
          columns={columns}
          data={rows}
          defaultColumnVisibility={defaultColumnVisibility}
          defaultColumnPinning={{
            left: ["Select", "User"],
          }}
          withColumnOrdering
          withFilters
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
        {deactivateEmployeeModal.isOpen && (
          <DeactivateUsersModal
            userIds={selectedUserIds}
            isOpen={deactivateEmployeeModal.isOpen}
            onClose={deactivateEmployeeModal.onClose}
          />
        )}
        {resendInviteModal.isOpen && (
          <ResendInviteModal
            userIds={selectedUserIds}
            isOpen={resendInviteModal.isOpen}
            onClose={resendInviteModal.onClose}
          />
        )}
      </>
    );
  }
);

// const EditableName = ({
//   value,
//   row,
//   accessorKey,
//   onUpdate,
// }: EditableTableCellComponentProps<Employee>) => {
//   const { supabase } = useSupabase();
//   // @ts-ignore
//   const userId = row?.user?.id as string;
//   if (userId === undefined) {
//     throw new Error("Expected user id to be defined");
//   }

//   const updateName = async (name: string) => {
//     const [table, column] = accessorKey.split(".");
//     onUpdate(name);
//     await supabase
//       ?.from(table)
//       .update({ [column]: name })
//       .eq("id", userId);
//   };

//   const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") {
//       updateName(event.currentTarget.value);
//     }
//   };

//   return (
//     <Input autoFocus defaultValue={value as string} onKeyDown={onKeyDown} />
//   );
// };

EmployeesTable.displayName = "EmployeeTable";

export default EmployeesTable;
