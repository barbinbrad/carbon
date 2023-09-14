import { CreatableSelect } from "@carbon/react";
import { convertKbToString } from "@carbon/utils";
import {
  HStack,
  Icon,
  Image,
  Link,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
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
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { VscOpenPreview } from "react-icons/vsc";
import { Avatar, Table } from "~/components";
import { Confirm, ConfirmDelete } from "~/components/Modals";
import { useUrlParams } from "~/hooks";
import type { Document, DocumentLabel } from "~/modules/documents";
import { DocumentIcon } from "~/modules/documents";
import { useDocument } from "../useDocument";

type DocumentsTableProps = {
  data: Document[];
  count: number;
  labels: DocumentLabel[];
};

const DocumentsTable = memo(({ data, count, labels }: DocumentsTableProps) => {
  const [params] = useUrlParams();
  const filter = params.get("q");
  // put rows in state for use with optimistic ui updates
  const [rows, setRows] = useState<Document[]>(data);
  // we have to do this useEffect silliness since we're putitng rows
  // in state for optimistic ui updates
  useEffect(() => {
    setRows(data);
  }, [data]);

  const {
    canUpdate,
    canDelete,
    deleteLabel,
    download,
    edit,
    favorite,
    isImage,
    label,
    makePreview,
    setLabel,
  } = useDocument();

  const documentLabelModal = useDisclosure();
  const deleteDocumentModal = useDisclosure();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const labelOptions =
    labels.map(({ label }) => ({
      value: label as string,
      label: label as string,
    })) ?? [];

  const onDeleteLabel = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      row: Document,
      label: string
    ) => {
      e.stopPropagation();
      // optimistically update the UI and then make the mutation
      setRows((prev) => {
        const index = prev.findIndex((item) => item.id === row.id);
        const updated = [...prev];
        const labelIndex = updated[index].labels.findIndex(
          (item) => item === label
        );
        updated[index].labels.splice(labelIndex, 1);
        return updated;
      });
      // mutate the database
      await deleteLabel(row, label);
    },
    [deleteLabel]
  );

  const onLabel = useCallback(
    async (row: Document, labels: string[]) => {
      // optimistically update the UI and then make the mutation
      setRows((prev) => {
        const index = prev.findIndex((item) => item.id === row.id);
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          labels: labels.sort(),
        };
        return updated;
      });
      // mutate the database
      await label(row, labels);
    },
    [label]
  );

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
            <Icon
              color={row.original.favorite ? "yellow.400" : "gray.300"}
              cursor="pointer"
              h={4}
              w={4}
              as={row.original.favorite ? BsStarFill : BsStar}
              onClick={() => onFavorite(row.original)}
            />
            <DocumentIcon fileName={row.original.name} />
            <Link onClick={() => download(row.original)}>
              {row.original.name}
            </Link>
          </HStack>
        ),
      },
      {
        id: "labels",
        header: "Labels",
        cell: ({ row }) => (
          <HStack spacing={1}>
            {row.original.labels.map((label) => (
              <Tag key={label} cursor="pointer" onClick={() => setLabel(label)}>
                <TagLabel>{label}</TagLabel>
                <TagCloseButton
                  onClick={(e) => onDeleteLabel(e, row.original, label)}
                />
              </Tag>
            ))}

            <Tag
              cursor="pointer"
              onClick={() => {
                setSelectedDocument(row.original);
                documentLabelModal.onOpen();
              }}
            >
              <TagLabel>
                <IoMdAdd />
              </TagLabel>
            </Tag>
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
  }, [documentLabelModal, download, onDeleteLabel, onFavorite, setLabel]);

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
        <MenuItem
          icon={<VscOpenPreview />}
          isDisabled={!row.type || !isImage(row.type)}
          onClick={async () => setPreviewImage(await makePreview(row))}
        >
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
          onClick={() => {
            setSelectedDocument(row);
            deleteDocumentModal.onOpen();
          }}
        >
          {filter !== "trash" ? "Move to Trash" : "Restore from Trash"}
        </MenuItem>
      </>
    );
  }, [
    canDelete,
    canUpdate,
    deleteDocumentModal,
    download,
    edit,
    filter,
    isImage,
    makePreview,
    onFavorite,
  ]);

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

      {previewImage && (
        <Modal isOpen onClose={() => setPreviewImage(null)} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader />
            <ModalCloseButton />
            <ModalBody>
              <Image src={previewImage ?? ""} />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {selectedDocument && (
        <Modal
          isOpen={documentLabelModal.isOpen}
          onClose={() => {
            setSelectedDocument(null);
            documentLabelModal.onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedDocument.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <CreatableSelect
                defaultValue={
                  selectedDocument.labels.map((label) => ({
                    value: label,
                    label: label,
                  })) ?? []
                }
                isClearable
                isMulti
                options={labelOptions}
                onChange={(newValues) =>
                  onLabel(
                    selectedDocument,
                    newValues.map((v) => v.value)
                  )
                }
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {selectedDocument &&
        (filter !== "trash" ? (
          <ConfirmDelete
            action={`/x/documents/${selectedDocument?.id}/delete`}
            isOpen={deleteDocumentModal.isOpen}
            name={selectedDocument.name}
            text={`Are you sure you want to move ${selectedDocument.name} to the trash?`}
            onCancel={() => {
              deleteDocumentModal.onClose();
              setSelectedDocument(null);
            }}
            onSubmit={() => {
              deleteDocumentModal.onClose();
              setSelectedDocument(null);
            }}
          />
        ) : (
          <Confirm
            action={`/x/documents/${selectedDocument?.id}/restore`}
            isOpen={deleteDocumentModal.isOpen}
            name={`Restore ${selectedDocument.name}`}
            text={`Are you sure you want to restore ${selectedDocument.name} from the trash?`}
            onCancel={() => {
              deleteDocumentModal.onClose();
              setSelectedDocument(null);
            }}
            onSubmit={() => {
              deleteDocumentModal.onClose();
              setSelectedDocument(null);
            }}
          />
        ))}
    </>
  );
});

DocumentsTable.displayName = "DocumentsTable";

export default DocumentsTable;
