import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsPencilSquare, BsListUl, BsPlus } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { EquipmentType } from "~/interfaces/Resources/types";

type EquipmentTypesTableProps = {
  data: EquipmentType[];
  count: number;
};

const EquipmentTypesTable = memo(
  ({ data, count }: EquipmentTypesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedType, setSelectedType] = useState<
      EquipmentType | undefined
    >();

    const onDelete = (data: EquipmentType) => {
      setSelectedType(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedType(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
      return [
        {
          accessorKey: "name",
          header: "Equipment Type",
          cell: (item) => item.getValue(),
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
          header: "Equipment",
          cell: ({ row }) => (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => {
                  navigate(
                    `/x/resources/equipment/list/${
                      row.original.id
                    }?${params?.toString()}`
                  );
                }}
              >
                {Array.isArray(row.original.equipment)
                  ? row.original.equipment?.length ?? 0
                  : 0}{" "}
                Units
              </Button>
              <IconButton
                aria-label="Add unit"
                icon={<BsPlus />}
                onClick={() => {
                  navigate(
                    `/x/resources/equipment/list/${
                      row.original.id
                    }/new?${params?.toString()}`
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
      (row: typeof data[number]) => JSX.Element
    >(
      (row) => (
        <>
          <MenuItem
            icon={<BiAddToQueue />}
            onClick={() => {
              navigate(
                `/x/resources/equipment/list/${
                  row.id
                }/new?${params?.toString()}`
              );
            }}
          >
            New Unit
          </MenuItem>
          <MenuItem
            icon={<BsListUl />}
            onClick={() => {
              navigate(
                `/x/resources/equipment/list/${row.id}?${params?.toString()}`
              );
            }}
          >
            View Equipment
          </MenuItem>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/resources/equipment/${row.id}`);
            }}
          >
            Edit Equipment Type
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "users")}
            icon={<IoMdTrash />}
            onClick={() => onDelete(row)}
          >
            Delete Equipment Type
          </MenuItem>
        </>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [navigate, params, permissions]
    );

    return (
      <>
        <Table<typeof data[number]>
          data={data}
          columns={columns}
          count={count ?? 0}
          renderContextMenu={renderContextMenu}
        />

        <ConfirmDelete
          action={`/x/resources/equipment/delete/${selectedType?.id}`}
          name={selectedType?.name ?? ""}
          text={`Are you sure you want to deactivate the ${selectedType?.name} equipment type?`}
          isOpen={deleteModal.isOpen}
          onCancel={onDeleteCancel}
          onSubmit={onDeleteCancel}
        />
      </>
    );
  }
);

EquipmentTypesTable.displayName = "EquipmentTypesTable";
export default EquipmentTypesTable;
