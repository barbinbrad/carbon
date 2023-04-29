import { convertKbToString } from "@carbon/utils";
import { HStack, Link, MenuItem, Text } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsEyeFill, BsPencilSquare, BsStar, BsTag } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { VscCloudDownload, VscOpenPreview } from "react-icons/vsc";
import { Avatar, Table } from "~/components";
import { usePermissions, useUrlParams, useUser } from "~/hooks";
import type { Document } from "~/modules/documents";
import DocumentIcon from "../DocumentIcon/DocumentIcon";

type DocumentsTableProps = {
  data: Document[];
  count: number;
};

const DocumentsTable = memo(({ data, count }: DocumentsTableProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const [params] = useUrlParams();
  const user = useUser();

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
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
          if (Array.isArray(row.original.createdBy)) {
            throw new Error("Expected createdBy to be an object");
          }
          return (
            <HStack>
              <Avatar
                size="sm"
                // @ts-ignore
                path={row.original.createdBy?.avatarUrl ?? undefined}
              />
              {/* @ts-ignore */}
              <Text>{row.original.createdBy?.fullName}</Text>
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
        onClick: (selected: Document[]) => {
          console.log("move to favorites", selected);
        },
      },
      {
        label: "Export Files (zip)",
        icon: <VscCloudDownload />,
        onClick: (selected: Document[]) => {
          console.log("export files", selected);
        },
      },
      {
        label: "Move to Trash",
        icon: <IoMdTrash />,
        disabled: !permissions.can("delete", "documents"),
        onClick: (selected: Document[]) => {
          console.log("move to trash", selected);
        },
      },
      {
        label: "Update Visibility",
        icon: <BsEyeFill />,
        disabled: !permissions.can("update", "documents"),
        onClick: (selected: Document[]) => {
          console.log("update visibility", selected);
        },
      },
    ];
  }, [permissions]);

  const defaultColumnVisibility = {
    createdAt: false,
    updatedAt: false,
    description: false,
  };

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Document) => (
      <>
        <MenuItem
          icon={<VscOpenPreview />}
          onClick={() =>
            navigate(`/x/documents/search/${row.id}/preview?${params}`)
          }
        >
          Preview
        </MenuItem>
        <MenuItem
          icon={<BsPencilSquare />}
          isDisabled={
            !permissions.can("update", "documents") ||
            !row.writeGroups?.some((group) => user?.groups.includes(group))
          }
          onClick={() =>
            navigate(`/x/documents/search/${row.id}/edit?${params}`)
          }
        >
          Edit
        </MenuItem>
        <MenuItem
          icon={<VscOpenPreview />}
          onClick={() => console.log(`download ${row.id}`)}
        >
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
          isDisabled={
            !permissions.can("delete", "documents") ||
            !row.writeGroups?.some((group) => user?.groups.includes(group))
          }
          onClick={() => console.log(`delete ${row.id}`)}
        >
          Move to Trash
        </MenuItem>
      </>
    );
  }, [navigate, params, permissions, user?.groups]);

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
