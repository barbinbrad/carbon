import { Avatar, HStack, Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Contractor } from "~/modules/resources";

type ContractorsTableProps = {
  data: Contractor[];
  count: number;
};

const ContractorsTable = memo(({ data, count }: ContractorsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data.map((row) => ({
    ...row,
  }));

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack spacing={2}>
            <Avatar size="sm" name={row.original.supplierName ?? ""} />

            <Link
              onClick={() => {
                navigate(`/x/purchasing/suppliers/${row?.original.supplierId}`);
              }}
            >
              {row.original.supplierName}
            </Link>
          </HStack>
        ),
      },
      {
        header: "Contractor",
        cell: ({ row }) => (
          <>{`${row.original.firstName} ${row.original.lastName}`}</>
        ),
      },
      {
        accessorKey: "hoursPerWeek",
        header: "Hours per Week",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `/x/resources/contractors/${
                  row.supplierContactId
                }?${params.toString()}`
              );
            }}
          >
            Edit Contractor
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/resources/contractors/delete/${
                  row.supplierContactId
                }?${params.toString()}`
              );
            }}
          >
            Delete Contractor
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<(typeof rows)[number]>
      data={rows}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

ContractorsTable.displayName = "ContractorsTable";
export default ContractorsTable;
