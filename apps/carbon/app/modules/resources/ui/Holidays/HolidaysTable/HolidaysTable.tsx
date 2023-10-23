import { Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Holiday } from "~/modules/resources";
import { path } from "~/utils/path";

type HolidaysTableProps = {
  data: Holiday[];
  count: number;
};

const HolidaysTable = memo(({ data, count }: HolidaysTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data;

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Holiday",
        cell: ({ row }) => (
          <Link onClick={() => navigate(row.original.id)}>
            {`${row.original.name} (${row.original.year})`}
          </Link>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (item) => item.getValue(),
      },
    ];
  }, [navigate]);

  const renderContextMenu = useCallback(
    (row: (typeof data)[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`${path.to.holiday(row.id)}?${params.toString()}`);
            }}
          >
            Edit Holiday
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(`${path.to.deleteHoliday(row.id)}?${params.toString()}`);
            }}
          >
            Delete Holiday
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

HolidaysTable.displayName = "HolidaysTable";
export default HolidaysTable;
