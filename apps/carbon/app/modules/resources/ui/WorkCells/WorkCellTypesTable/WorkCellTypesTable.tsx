import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Icon,
  IconButton,
  Link,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import {
  BsFillCheckCircleFill,
  BsListUl,
  BsPencilSquare,
  BsPlus,
} from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { WorkCellType } from "~/modules/resources";
import { path } from "~/utils/path";

type WorkCellTypesTableProps = {
  data: WorkCellType[];
  count: number;
};

const WorkCellTypesTable = memo(({ data, count }: WorkCellTypesTableProps) => {
  const navigate = useNavigate();
  const [params] = useUrlParams();
  const permissions = usePermissions();
  const deleteModal = useDisclosure();
  const [selectedType, setSelectedType] = useState<WorkCellType | undefined>();

  const onDelete = (data: WorkCellType) => {
    setSelectedType(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedType(undefined);
    deleteModal.onClose();
  };

  const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Work Cell Type",
        cell: ({ row }) => (
          <HStack>
            <Link onClick={() => navigate(row.original.id)}>
              {row.original.name}
            </Link>
            {row.original.requiredAbility && (
              <Icon
                as={BsFillCheckCircleFill}
                color="green.500"
                title="Requires ability"
              />
            )}
          </HStack>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <Text maxW={300} overflow="hidden" textOverflow="ellipsis">
            {row.original.description}
          </Text>
        ),
      },
      {
        header: "Work Cells",
        cell: ({ row }) => (
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button
              onClick={() => {
                navigate(
                  `${path.to.workCellTypeList(
                    row.original.id
                  )}?${params?.toString()}`
                );
              }}
            >
              {Array.isArray(row.original.workCell)
                ? row.original.workCell.length
                : 0}{" "}
              Work Cells
            </Button>
            <IconButton
              aria-label="Add unit"
              icon={<BsPlus />}
              onClick={() => {
                navigate(
                  `${path.to.newWorkCellUnit(
                    row.original.id
                  )}?${params?.toString()}`
                );
              }}
            />
          </ButtonGroup>
        ),
      },
      {
        accessorKey: "color",
        header: "Color",
        cell: (item) => (
          <Box
            aria-label="Color"
            w={6}
            h={6}
            borderRadius="md"
            bg={item.getValue() ?? "#000000"}
            role="img"
          />
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const renderContextMenu = useCallback<
    (row: (typeof data)[number]) => JSX.Element
  >(
    (row) => (
      <>
        <MenuItem
          icon={<BiAddToQueue />}
          onClick={() => {
            navigate(
              `${path.to.newWorkCellUnit(row.id)}?${params?.toString()}`
            );
          }}
        >
          New Unit
        </MenuItem>
        <MenuItem
          icon={<BsListUl />}
          onClick={() => {
            navigate(
              `${path.to.workCellTypeList(row.id)}?${params?.toString()}`
            );
          }}
        >
          Edit Work Cells
        </MenuItem>
        <MenuItem
          icon={<BsPencilSquare />}
          onClick={() => {
            navigate(path.to.workCellType(row.id));
          }}
        >
          Edit Work Cell Type
        </MenuItem>
        <MenuItem
          isDisabled={!permissions.can("delete", "users")}
          icon={<IoMdTrash />}
          onClick={() => onDelete(row)}
        >
          Delete Work Cell Type
        </MenuItem>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate, params, permissions]
  );

  return (
    <>
      <Table<(typeof data)[number]>
        data={data}
        columns={columns}
        count={count ?? 0}
        renderContextMenu={renderContextMenu}
      />

      {selectedType && selectedType.id && (
        <ConfirmDelete
          action={path.to.deleteWorkCellType(selectedType.id)}
          name={selectedType?.name ?? ""}
          text={`Are you sure you want to deactivate the ${selectedType?.name} work cell type?`}
          isOpen={deleteModal.isOpen}
          onCancel={onDeleteCancel}
          onSubmit={onDeleteCancel}
        />
      )}
    </>
  );
});

WorkCellTypesTable.displayName = "WorkCellTypesTable";
export default WorkCellTypesTable;
