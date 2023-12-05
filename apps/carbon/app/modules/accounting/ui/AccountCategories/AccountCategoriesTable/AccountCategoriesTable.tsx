import {
  Button,
  ButtonGroup,
  IconButton,
  Link,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsListUl, BsPencilSquare, BsPlus } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { AccountCategory } from "~/modules/accounting";
import { path } from "~/utils/path";

type AccountCategoriesTableProps = {
  data: AccountCategory[];
  count: number;
};

const AccountCategoriesTable = memo(
  ({ data, count }: AccountCategoriesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<
      AccountCategory | undefined
    >();

    const onDelete = (data: AccountCategory) => {
      setSelectedCategory(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedCategory(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      return [
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => (
            <Link onClick={() => navigate(row.original.id as string)}>
              {row.original.category}
            </Link>
          ),
        },
        {
          header: "Income/Balance",
          accessorKey: "incomeBalance",
          cell: (item) => item.getValue(),
        },
        {
          header: "Class",
          accessorKey: "class",
          cell: (item) => item.getValue(),
        },

        {
          header: "Subcategories",
          cell: ({ row }) => (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => {
                  navigate(
                    `${path.to.accountingCategoryList(
                      row.original.id!
                    )}?${params?.toString()}`
                  );
                }}
              >
                {row.original.subCategoriesCount ?? 0} Subcategories
              </Button>
              <IconButton
                aria-label="Add subcategory"
                icon={<BsPlus />}
                onClick={() => {
                  navigate(
                    `${path.to.newAccountingSubcategory(
                      row.original.id!
                    )}?${params?.toString()}`
                  );
                }}
              />
            </ButtonGroup>
          ),
        },
      ];
    }, [navigate, params]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        if (!row.id) return null;
        return (
          <>
            <MenuItem
              icon={<BiAddToQueue />}
              onClick={() => {
                navigate(
                  `${path.to.newAccountingSubcategory(
                    row.id!
                  )}${params?.toString()}`
                );
              }}
            >
              New Subcategory
            </MenuItem>
            <MenuItem
              icon={<BsListUl />}
              onClick={() => {
                navigate(
                  `${path.to.accountingCategoryList(
                    row.id!
                  )}?${params?.toString()}`
                );
              }}
            >
              View Subcategories
            </MenuItem>
            <MenuItem
              icon={<BsPencilSquare />}
              onClick={() => {
                navigate(path.to.accountingCategory(row.id!));
              }}
            >
              Edit Account Category
            </MenuItem>
            <MenuItem
              isDisabled={!permissions.can("delete", "users")}
              icon={<IoMdTrash />}
              onClick={() => onDelete(row)}
            >
              Delete Account Category
            </MenuItem>
          </>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [navigate, params, permissions]
    );

    return (
      <>
        <Table<AccountCategory>
          data={data}
          columns={columns}
          count={count ?? 0}
          renderContextMenu={renderContextMenu}
        />

        {selectedCategory && selectedCategory.id && (
          <ConfirmDelete
            action={path.to.deleteAccountingCategory(selectedCategory.id)}
            name={selectedCategory?.category ?? ""}
            text={`Are you sure you want to deactivate the ${selectedCategory?.category} account category?`}
            isOpen={deleteModal.isOpen}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

AccountCategoriesTable.displayName = "AccountCategoriesTable";
export default AccountCategoriesTable;
