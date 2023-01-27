import { ActionMenu } from "@carbon/react";
import {
  Badge,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  MenuItem,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsPencilSquare, BsListUl, BsPlus } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { AttributeCategory } from "~/interfaces/Users/types";

type AttributeCategoriesTableProps = {
  data: AttributeCategory[];
  count: number;
};

const AttributeCategoriesTable = memo(
  ({ data, count }: AttributeCategoriesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<
      AttributeCategory | undefined
    >();

    const onDelete = (data: AttributeCategory) => {
      setSelectedCategory(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedCategory(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
      return [
        {
          accessorKey: "name",
          header: "Category",
          cell: (item) => item.getValue(),
        },
        {
          header: "Attributes",
          cell: ({ row }) => (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => {
                  navigate(
                    `/x/people/attributes/list/${
                      row.original.id
                    }?${params.toString()}`
                  );
                }}
              >
                {Array.isArray(row.original.userAttribute)
                  ? row.original.userAttribute?.length ?? 0
                  : 0}{" "}
                Attributes
              </Button>
              <IconButton
                aria-label="Add attribute"
                icon={<BsPlus />}
                onClick={() => {
                  navigate(
                    `/x/people/attributes/list/${
                      row.original.id
                    }/new?${params.toString()}`
                  );
                }}
              />
            </ButtonGroup>
          ),
        },
        {
          header: "Visibility",
          accessorKey: "public",
          cell: (item) => {
            const isPublic = item.getValue<boolean>().toString() === "true";
            return (
              <Badge
                size="sm"
                variant={isPublic ? undefined : "outline"}
                colorScheme={isPublic ? "green" : "gray "}
              >
                {isPublic ? "Public" : "Private"}
              </Badge>
            );
          },
        },

        {
          accessorKey: "id",
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          cell: ({ row }) => (
            <Flex justifyContent="end">
              <ActionMenu>
                <MenuItem
                  icon={<BiAddToQueue />}
                  onClick={() => {
                    navigate(
                      `/x/people/attributes/list/${
                        row.original.id
                      }/new?${params.toString()}`
                    );
                  }}
                >
                  New Attribute
                </MenuItem>
                <MenuItem
                  icon={<BsListUl />}
                  onClick={() => {
                    navigate(
                      `/x/people/attributes/list/${
                        row.original.id
                      }?${params.toString()}`
                    );
                  }}
                >
                  View Attributes
                </MenuItem>
                <MenuItem
                  icon={<BsPencilSquare />}
                  onClick={() => {
                    navigate(`/x/people/attributes/${row.original.id}`);
                  }}
                >
                  Edit Attribute Category
                </MenuItem>
                <MenuItem
                  isDisabled={
                    row.original.protected ||
                    !permissions.can("delete", "users")
                  }
                  icon={<IoMdTrash />}
                  onClick={() => onDelete(row.original)}
                >
                  Delete Category
                </MenuItem>
              </ActionMenu>
            </Flex>
          ),
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    return (
      <>
        <Table<typeof data[number]>
          data={data}
          columns={columns}
          count={count}
        />

        <ConfirmDelete
          action={`/x/people/attributes/delete/${selectedCategory?.id}`}
          name={selectedCategory?.name ?? ""}
          text={`Are you sure you want to deactivate the ${selectedCategory?.name} attribute category?`}
          isOpen={deleteModal.isOpen}
          onCancel={onDeleteCancel}
          onSubmit={onDeleteCancel}
        />
      </>
    );
  }
);

AttributeCategoriesTable.displayName = "AttributeCategoriesTable";
export default AttributeCategoriesTable;
