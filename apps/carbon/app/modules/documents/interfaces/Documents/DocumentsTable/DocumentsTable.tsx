import { HStack, Link, MenuItem } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsEyeFill } from "react-icons/bs";
import { Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { Document } from "~/modules/documents";
import DocumentIcon from "../DocumentIcon/DocumentIcon";

type DocumentsTableProps = {
  data: Document[];
  count: number;
};

const DocumentsTable = memo(({ data, count }: DocumentsTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();

  const columns = useMemo<ColumnDef<Document>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <HStack>
            <DocumentIcon fileName={row.original.name} />
            <Link>{row.original.name}</Link>
          </HStack>
        ),
      },

      {
        accessorKey: "size",
        header: "Size",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Document) => (
      <MenuItem
        icon={<BsEyeFill />}
        onClick={() => navigate(`/x/documents/search/${row.id}?${params}`)}
      >
        Preview
      </MenuItem>
    );
  }, [navigate, params]);

  return (
    <>
      <Table<Document>
        count={count}
        columns={columns}
        data={data}
        withColumnOrdering
        withFilters
        withPagination
        withSimpleSorting
        withSelectableRows
        renderContextMenu={renderContextMenu}
      />
    </>
  );
});

DocumentsTable.displayName = "DocumentsTable";

export default DocumentsTable;
