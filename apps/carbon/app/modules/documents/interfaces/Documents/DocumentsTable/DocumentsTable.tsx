import { convertKbToString } from "@carbon/utils";
import {
  Box,
  HStack,
  Icon,
  Link,
  MenuItem,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  BsEyeFill,
  BsPencilSquare,
  BsStar,
  BsStarFill,
  BsTag,
} from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { VscOpenPreview } from "react-icons/vsc";
import { Avatar, Table } from "~/components";
import { useUrlParams } from "~/hooks";
import type { Document } from "~/modules/documents";
import DocumentIcon from "../DocumentIcon/DocumentIcon";
import { useDocument } from "../useDocument";

type DocumentsTableProps = {
  data: Document[];
  count: number;
};

const DocumentsTable = memo(({ data, count }: DocumentsTableProps) => {
  const [params] = useUrlParams();
  const filter = params.get("filter");
  // put rows in state for use with optimistic ui updates
  const [rows, setRows] = useState<Document[]>(data);
  // we have to do this useEffect silliness since we're putitng rows
  // in state for optimistic ui updates
  useEffect(() => {
    setRows(data);
  }, [data]);

  const { canUpdate, canDelete, download, edit, favorite, preview, setLabel } =
    useDocument();

  const onFavorite = useCallback(
    async (row: Document) => {
      // optimistically update the UI and then make the mutation
      setRows((prev) => {
        const index = prev.findIndex((item) => item.id === row.id);
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          favorite: !updated[index].favorite,
        };
        return filter === "starred"
          ? updated.filter((item) => item.favorite === true)
          : updated;
      });
      // mutate the database
      await favorite(row);
    },
    [favorite, filter]
  );

  const columns = useMemo<ColumnDef<Document>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <HStack>
            <Box
              color={row.original.favorite ? "yellow.400" : "gray.300"}
              cursor="pointer"
            >
              <Icon
                h={4}
                w={4}
                as={row.original.favorite ? BsStarFill : BsStar}
                onClick={() => onFavorite(row.original)}
              />
            </Box>
            <DocumentIcon fileName={row.original.name} />
            <Link>{row.original.name}</Link>
          </HStack>
        ),
      },
      {
        id: "labels",
        header: "Labels",
        cell: ({ row }) => (
          <HStack>
            {row.original.labels.map((label) => (
              <Tag
                key={label}
                variant="solid"
                colorScheme="blackAlpha"
                cursor="pointer"
                onClick={() => setLabel(label)}
              >
                <TagLabel>{label}</TagLabel>
              </Tag>
            ))}
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
  }, [onFavorite, setLabel]);

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
          onClick={() => {
            onFavorite(row);
          }}
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
  }, [canDelete, canUpdate, download, edit, onFavorite, preview]);

  return (
    <>
      <Table<Document>
        actions={actions}
        count={count}
        columns={columns}
        data={rows}
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
