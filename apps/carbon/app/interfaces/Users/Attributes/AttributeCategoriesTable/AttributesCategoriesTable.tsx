import { ActionMenu } from "@carbon/react";
import {
  Badge,
  Button,
  Flex,
  MenuItem,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Link, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsPencilSquare, BsListUl } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { AttributeCategory } from "~/interfaces/Users/types";
import DeleteAttributeCategoryModal from "../DeleteAttributeCategoryModal";

type AttributeCategoriesTableProps = {
  data: AttributeCategory[];
  count: number;
};

const AttributeCategoriesTable = memo(
  ({ data, count }: AttributeCategoriesTableProps) => {
    const navigate = useNavigate();
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
            <Button
              as={Link}
              to={`/app/users/attributes/list/${row.original.id}`}
              variant="outline"
            >
              {Array.isArray(row.original.userAttribute)
                ? row.original.userAttribute?.length ?? 0
                : 0}{" "}
              Attributes
            </Button>
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
                      `/app/users/attributes/list/${row.original.id}/new`
                    );
                  }}
                >
                  New Attribute
                </MenuItem>
                <MenuItem
                  icon={<BsListUl />}
                  onClick={() => {
                    navigate(`/app/users/attributes/list/${row.original.id}`);
                  }}
                >
                  View Attributes
                </MenuItem>
                <MenuItem
                  icon={<BsPencilSquare />}
                  onClick={() => {
                    navigate(`/app/users/attributes/${row.original.id}`);
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
    }, []);

    return (
      <>
        <Table<typeof data[number]>
          data={data}
          columns={columns}
          count={count}
        />
        <DeleteAttributeCategoryModal
          onCancel={onDeleteCancel}
          isOpen={deleteModal.isOpen}
          data={selectedCategory}
        />
      </>
    );
  }
);

AttributeCategoriesTable.displayName = "AttributeCategoriesTable";
export default AttributeCategoriesTable;
