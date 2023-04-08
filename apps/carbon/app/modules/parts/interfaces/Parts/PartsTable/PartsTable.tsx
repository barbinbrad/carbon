import { MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { PartsTableRow } from "~/modules/parts";

type PartsTableProps = {
  data: PartsTableRow[];
  count: number;
};

const PartsTable = memo(({ data, count }: PartsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<PartsTableRow>[]>(() => {
    return [
      {
        accessorKey: "id",
        header: "Part ID",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorKey: "partType",
        header: "Part Type",
        cell: (item) => item.getValue(),
      },
      {
        // @ts-ignore
        accessorFn: (item) => item.partGroup?.name ?? "",
        header: "Part Group",
        cell: (item) => item.getValue(),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(() => {
    return permissions.can("update", "parts")
      ? (row: PartsTableRow) => {
          return (
            <MenuItem
              icon={<BsPencilSquare />}
              onClick={() => navigate(`/x/parts/${row.id}`)}
            >
              Edit Part
            </MenuItem>
          );
        }
      : undefined;
  }, [navigate, permissions]);

  return (
    <>
      <Table<PartsTableRow>
        count={count}
        columns={columns}
        data={data}
        withPagination
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

PartsTable.displayName = "PartTable";

export default PartsTable;
