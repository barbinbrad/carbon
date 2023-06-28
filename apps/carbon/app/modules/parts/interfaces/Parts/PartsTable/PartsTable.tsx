import { MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { PartsTableRow } from "~/modules/parts";

type PartsTableProps = {
  data: PartsTableRow[];
  count: number;
};

const PartsTable = memo(({ data, count }: PartsTableProps) => {
  const navigate = useNavigate();
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
        accessorKey: "partType",
        header: "Part Type",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "replenishmentSystem",
        header: "Replenishment",
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
    // eslint-disable-next-line react/display-name
    return (row: PartsTableRow) => (
      <MenuItem
        icon={<BsPencilSquare />}
        onClick={() => navigate(`/x/part/${row.id}`)}
      >
        Edit Part
      </MenuItem>
    );
  }, [navigate]);

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
