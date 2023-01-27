import { ActionMenu } from "@carbon/react";
import {
  Flex,
  HStack,
  MenuItem,
  VisuallyHidden,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsEnvelope, BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Customer } from "~/interfaces/Users/types";
import { ResendInviteModal, DeactivateUsersModal } from "~/interfaces/Users";
import { FaBan } from "react-icons/fa";

type CustomerAccountsTableProps = {
  data: Customer[];
  count: number;
  isEditable?: boolean;
};

const defaultColumnVisibility = {
  user_firstName: false,
  user_lastName: false,
};

const CustomerAccountsTable = memo(
  ({ data, count, isEditable = false }: CustomerAccountsTableProps) => {
    const navigate = useNavigate();
    const permissions = usePermissions();
    const [params] = useUrlParams();

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const deactivateCustomerModal = useDisclosure();
    const resendInviteModal = useDisclosure();

    const rows = useMemo(
      () =>
        data.map((d) => {
          // we should only have one user and customer per customer id
          if (
            d.user === null ||
            d.customer === null ||
            Array.isArray(d.user) ||
            Array.isArray(d.customer)
          ) {
            throw new Error("Expected user and customer to be objects");
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
          accessorKey: "customer.name",
          header: "Customer",
          cell: (item) => item.getValue(),
        },
        {
          header: "Customer Type",
          cell: ({ row }) => {
            // @ts-ignore
            const customerType = row.original.customer?.customerType;
            return customerType ? customerType.name : "";
          },
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
                        `/x/users/customers/${
                          item.getValue() as string
                        }?${params.toString()}`
                      )
                    }
                  >
                    Edit Customer
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
                          deactivateCustomerModal.onOpen();
                        }}
                      >
                        Deactivate Customer
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
            deactivateCustomerModal.onOpen();
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
          withColumnOrdering
          withFilters
          withPagination
          withSelectableRows={isEditable}
        />

        {deactivateCustomerModal.isOpen && (
          <DeactivateUsersModal
            userIds={selectedUserIds}
            isOpen={deactivateCustomerModal.isOpen}
            redirectTo="/x/users/suppliers"
            onClose={deactivateCustomerModal.onClose}
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

CustomerAccountsTable.displayName = "CustomerTable";

export default CustomerAccountsTable;
