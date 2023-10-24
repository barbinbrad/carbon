import { Avatar, HStack, Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Contractor } from "~/modules/resources";
import { path } from "~/utils/path";

type ContractorsTableProps = {
  data: Contractor[];
  count: number;
};

const ContractorsTable = memo(({ data, count }: ContractorsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Contractor>[]>(() => {
    return [
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack spacing={2}>
            <Avatar size="sm" name={row.original.supplierName ?? ""} />

            <Link
              onClick={() => {
                navigate(path.to.supplier(row.original.supplierId!));
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
    (row: Contractor) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(
                `${path.to.contractor(
                  row.supplierContactId!
                )}?${params.toString()}`
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
                `${path.to.deleteContractor(
                  row.supplierContactId!
                )}?${params.toString()}`
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
    <Table<Contractor>
      data={data}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

ContractorsTable.displayName = "ContractorsTable";
export default ContractorsTable;
