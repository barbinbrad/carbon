import {
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
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
import type { AccountCategory } from "~/modules/accounting";

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

    const columns = useMemo<ColumnDef<typeof data[number]>[]>(() => {
      return [
        {
          accessorKey: "category",
          header: "Category",
          cell: (item) => item.getValue(),
        },
        {
          header: "Income/Balance",
          accessorKey: "incomeBalance",
          cell: (item) => item.getValue(),
        },
        {
          header: "Debit/Credit",
          accessorKey: "normalBalance",
          cell: (item) => {
            const isDebit = item.getValue<string>() === "Debit";
            const isCredit = item.getValue<string>() === "Credit";
            return (
              <Badge
                size="sm"
                variant="outline"
                colorScheme={isDebit ? "green" : isCredit ? "red" : "gray"}
              >
                {item.getValue<string>()}
              </Badge>
            );
          },
        },

        {
          header: "Subcategories",
          cell: ({ row }) => (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => {
                  navigate(
                    `/x/accounting/categories/list/${
                      row.original.id
                    }?${params?.toString()}`
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
                    `/x/accounting/categories/list/${
                      row.original.id
                    }/new?${params?.toString()}`
                  );
                }}
              />
            </ButtonGroup>
          ),
        },
      ];
    }, [navigate, params]);

    const renderContextMenu = useCallback(
      (row: typeof data[number]) => {
        return (
          <>
            <MenuItem
              icon={<BiAddToQueue />}
              onClick={() => {
                navigate(
                  `/x/accounting/categories/list/${
                    row.id
                  }/new?${params?.toString()}`
                );
              }}
            >
              New Subcategory
            </MenuItem>
            <MenuItem
              icon={<BsListUl />}
              onClick={() => {
                navigate(
                  `/x/accounting/categories/list/${
                    row.id
                  }?${params?.toString()}`
                );
              }}
            >
              View Subcategories
            </MenuItem>
            <MenuItem
              icon={<BsPencilSquare />}
              onClick={() => {
                navigate(`/x/accounting/categories/${row.id}`);
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

        <ConfirmDelete
          action={`/x/accounting/categories/delete/${selectedCategory?.id}`}
          name={selectedCategory?.category ?? ""}
          text={`Are you sure you want to deactivate the ${selectedCategory?.category} account category?`}
          isOpen={deleteModal.isOpen}
          onCancel={onDeleteCancel}
          onSubmit={onDeleteCancel}
        />
      </>
    );
  }
);

AccountCategoriesTable.displayName = "AccountCategoriesTable";
export default AccountCategoriesTable;
