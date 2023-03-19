import { HStack, Link, MenuItem, Text } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Avatar, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { AttributeCategory, Person } from "~/modules/resources";
import { DataType } from "~/interfaces/Users/types";

type PeopleTableProps = {
  attributeCategories: AttributeCategory[];
  data: Person[];
  count: number;
  isEditable?: boolean;
};

const PeopleTable = memo(
  ({
    attributeCategories,
    data,
    count,
    isEditable = false,
  }: PeopleTableProps) => {
    const navigate = useNavigate();
    const permissions = usePermissions();
    const [params] = useUrlParams();

    const renderGenericAttribute = useCallback(
      (
        value?: string | number | boolean,
        dataType?: DataType,
        user?: {
          id: string;
          fullName: string | null;
          avatarUrl: string | null;
        } | null
      ) => {
        if (!value || !dataType) return null;

        if (dataType === DataType.Boolean) {
          return value === true ? "Yes" : "No";
        }

        if (dataType === DataType.Date) {
          return new Date(value as string).toLocaleDateString();
        }

        if (dataType === DataType.Numeric) {
          return Number(value).toLocaleString();
        }

        if (dataType === DataType.Text || dataType === DataType.List) {
          return value;
        }

        if (dataType === DataType.User) {
          if (!user) return null;
          return (
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={user.fullName ?? undefined}
                path={user.avatarUrl}
              />
              <Text>{user.fullName ?? ""}</Text>
            </HStack>
          );
        }

        return "Unknown";
      },
      []
    );

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
      const defaultColumns: ColumnDef<typeof rows[number]>[] = [
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

              <Link
                onClick={() => {
                  navigate(
                    // @ts-ignore
                    `/x/resources/person/${row?.original.user.id}`
                  );
                }}
              >
                {
                  // @ts-ignore
                  row.original.user?.fullName
                }
              </Link>
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
      ];

      const additionalColumns: ColumnDef<typeof rows[number]>[] = [];

      attributeCategories.forEach((category) => {
        if (category.userAttribute && Array.isArray(category.userAttribute)) {
          category.userAttribute.forEach((attribute) => {
            additionalColumns.push({
              id: attribute.id,
              header: attribute.name,
              cell: ({ row }) =>
                renderGenericAttribute(
                  row?.original?.attributes?.[attribute?.id]?.value,
                  row?.original?.attributes?.[attribute?.id]?.dataType,
                  row?.original?.attributes?.[attribute?.id]?.user
                ),
            });
          });
        }
      });

      return [...defaultColumns, ...additionalColumns];
    }, [attributeCategories, navigate, renderGenericAttribute]);

    // const actions = useMemo(() => {
    //   return [
    //     {
    //       label: "Message Employees",
    //       icon: <BsChat />,
    //       disabled: !permissions.can("create", "messaging"),
    //       onClick: (selected: typeof rows) => {
    //         console.log(selected);
    //       },
    //     },
    //   ];
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const renderContextMenu = useMemo(() => {
      return permissions.can("update", "resources")
        ? (row: typeof rows[number]) => {
            return (
              <MenuItem
                icon={<BsPencilSquare />}
                onClick={() =>
                  navigate(
                    // @ts-ignore
                    `/x/resources/person/${row.user?.id}?${params.toString()}`
                  )
                }
              >
                Edit Employee
              </MenuItem>
            );
          }
        : undefined;
    }, [navigate, params, permissions]);

    return (
      <>
        <Table<typeof rows[number]>
          // actions={actions}
          count={count}
          columns={columns}
          data={rows}
          defaultColumnPinning={{
            left: ["Select", "User"],
          }}
          renderContextMenu={renderContextMenu}
          withColumnOrdering
          // withInlineEditing
          withFilters
          withPagination
          // withSelectableRows={isEditable}
        />
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

PeopleTable.displayName = "EmployeeTable";

export default PeopleTable;
