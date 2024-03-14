import {
  Button,
  HStack,
  Hyperlink,
  MenuIcon,
  MenuItem,
  useDisclosure,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsFillCheckCircleFill, BsFillPenFill, BsListUl } from "react-icons/bs";
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
            <Hyperlink onClick={() => navigate(row.original.id)}>
              {row.original.name}
            </Hyperlink>
            {row.original.requiredAbility && (
              <BsFillCheckCircleFill
                className="text-green-500"
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
          <span className="max-w-[300px] line-clamp-1">
            {row.original.description}
          </span>
        ),
      },
      {
        header: "Work Cells",
        cell: ({ row }) => (
          <Button
            variant="secondary"
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
          onClick={() => {
            navigate(
              `${path.to.newWorkCellUnit(row.id)}?${params?.toString()}`
            );
          }}
        >
          <MenuIcon icon={<BiAddToQueue />} />
          New Unit
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(
              `${path.to.workCellTypeList(row.id)}?${params?.toString()}`
            );
          }}
        >
          <MenuIcon icon={<BsListUl />} />
          Edit Work Cells
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(path.to.workCellType(row.id));
          }}
        >
          <MenuIcon icon={<BsFillPenFill />} />
          Edit Work Cell Type
        </MenuItem>
        <MenuItem
          disabled={!permissions.can("delete", "users")}
          onClick={() => onDelete(row)}
        >
          <MenuIcon icon={<IoMdTrash />} />
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
