import { convertKbToString } from "@carbon/utils";
import { HStack, Link, MenuItem, Text } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsEyeFill, BsPencilSquare, BsStar, BsTag } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { VscOpenPreview } from "react-icons/vsc";
import { Avatar, Table } from "~/components";
import type { Document } from "~/modules/documents";
import DocumentIcon from "../DocumentIcon/DocumentIcon";
import { useDocument } from "../useDocument";

type DocumentsTableProps = {
  data: Document[];
  count: number;
};

const DocumentsTable = memo(({ data, count }: DocumentsTableProps) => {
  const { canUpdate, canDelete, download, edit, preview } = useDocument();

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
        cell: ({ row }) => convertKbToString(row.original.size),
      },
      {
        accessorKey: "createdByFullName",
        header: "Created By",
        cell: ({ row }) => {
          return (
            <HStack>
              <Avatar
                size="sm"
                path={row.original.createdByAvatar ?? undefined}
              />
              <Text>{row.original.createdByFullName}</Text>
            </HStack>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "updatedByFullName",
        header: "Updated By",
        cell: ({ row }) => {
          return row.original.updatedByFullName ? (
            <HStack>
              <Avatar size="sm" path={row.original.updatedByAvatar ?? null} />
              <Text>{row.original.updatedByFullName}</Text>
            </HStack>
          ) : null;
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: (item) => item.getValue(),
      },
    ];
  }, []);

  const actions = useMemo(() => {
    return [
      {
        label: "Add to Favorites",
        icon: <BsStar />,
        onClick: (selected: Document[]) => {
          console.log("move to favorites", selected);
        },
      },
      {
        label: "Add Labels",
        icon: <BsTag />,
        // TODO - disabled can be a function of selected
        disabled: true,
        onClick: (selected: Document[]) => {
          console.log("move to favorites", selected);
        },
      },
      {
        label: "Move to Trash",
        icon: <IoMdTrash />,
        // TODO - disabled can be a function of selected
        disabled: true,
        onClick: (selected: Document[]) => {
          console.log("move to trash", selected);
        },
      },
      {
        label: "Update Visibility",
        icon: <BsEyeFill />,
        // TODO - disabled can be a function of selected
        disabled: true,
        onClick: (selected: Document[]) => {
          console.log("update visibility", selected);
        },
      },
    ];
  }, []);

  const defaultColumnVisibility = {
    createdAt: false,
    updatedAt: false,
    description: false,
  };

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Document) => (
      <>
        <MenuItem icon={<VscOpenPreview />} onClick={() => preview(row)}>
          Preview
        </MenuItem>
        <MenuItem
          icon={<BsPencilSquare />}
          isDisabled={canUpdate(row)}
          onClick={() => edit(row)}
        >
          Edit
        </MenuItem>
        <MenuItem icon={<VscOpenPreview />} onClick={() => download(row)}>
          Download
        </MenuItem>
        <MenuItem
          icon={<BsStar />}
          onClick={() => console.log(`favorite ${row.id}`)}
        >
          Favorite
        </MenuItem>
        <MenuItem
          icon={<IoMdTrash />}
          isDisabled={canDelete(row)}
          onClick={() => console.log(`delete ${row.id}`)}
        >
          Move to Trash
        </MenuItem>
      </>
    );
  }, [canDelete, canUpdate, download, edit, preview]);

  return (
    <>
      <Table<Document>
        actions={actions}
        count={count}
        columns={columns}
        data={data}
        defaultColumnVisibility={defaultColumnVisibility}
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
