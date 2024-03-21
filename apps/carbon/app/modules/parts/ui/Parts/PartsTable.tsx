import { Enumerable, Hyperlink, MenuIcon, MenuItem } from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import type { Part } from "~/modules/parts";
import { path } from "~/utils/path";

type PartsTableProps = {
  data: Part[];
  count: number;
};

const PartsTable = memo(({ data, count }: PartsTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();
  const customColumns = useCustomColumns("part");

  const columns = useMemo<ColumnDef<Part>[]>(() => {
    const defaultColumns = [
      {
        accessorKey: "id",
        header: "Part ID",
        cell: ({ row }) => (
          <Hyperlink onClick={() => navigate(path.to.part(row.original.id!))}>
            {row.original.id}
          </Hyperlink>
        ),
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
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
      },
      {
        accessorKey: "replenishmentSystem",
        header: "Replenishment",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
      },
      {
        accessorKey: "partGroup",
        header: "Part Group",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
      },
    ];
    return [...defaultColumns, ...customColumns];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Part) => (
      <MenuItem onClick={() => navigate(path.to.part(row.id!))}>
        <MenuIcon icon={<BsFillPenFill />} />
        Edit Part
      </MenuItem>
    );
  }, [navigate]);

  return (
    <>
      <Table<Part>
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
