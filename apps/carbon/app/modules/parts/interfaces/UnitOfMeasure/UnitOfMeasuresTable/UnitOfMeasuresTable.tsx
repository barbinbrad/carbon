import { MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { UnitOfMeasure } from "~/modules/parts";

type UnitOfMeasuresTableProps = {
  data: UnitOfMeasure[];
  count: number;
};

const UnitOfMeasuresTable = memo(
  ({ data, count }: UnitOfMeasuresTableProps) => {
    const [params] = useUrlParams();
    const navigate = useNavigate();
    const permissions = usePermissions();

    const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
      return [
        {
          header: "Component",
          cell: ({ row }) => <p>{row.original.name}</p>,
        },
        {
          accessorKey: "name",
          header: "Name",
          cell: (item) => item.getValue(),
        },
        {
          accessorKey: "code",
          header: "Code",
          cell: (item) => item.getValue(),
        },
      ];
    }, []);

    const renderContextMenu = useCallback(
      (row: typeof data[number]) => {
        return (
          <>
            <MenuItem
              isDisabled={!permissions.can("update", "parts")}
              icon={<BsPencilSquare />}
              onClick={() => {
                navigate(`/x/parts/uom/${row.id}?${params.toString()}`);
              }}
            >
              Edit Unit of Measure
            </MenuItem>
            <MenuItem
              isDisabled={!permissions.can("delete", "parts")}
              icon={<IoMdTrash />}
              onClick={() => {
                navigate(`/x/parts/uom/delete/${row.id}?${params.toString()}`);
              }}
            >
              Delete Unit of Measure
            </MenuItem>
          </>
        );
      },
      [navigate, params, permissions]
    );

    return (
      <Table<typeof data[number]>
        data={data}
        columns={columns}
        count={count}
        renderContextMenu={renderContextMenu}
        withInlineEditing
      />
    );
  }
);

UnitOfMeasuresTable.displayName = "UnitOfMeasuresTable";
export default UnitOfMeasuresTable;
