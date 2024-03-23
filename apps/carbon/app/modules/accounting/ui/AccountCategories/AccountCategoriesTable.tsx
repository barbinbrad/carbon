import {
  Button,
  Enumerable,
  Hyperlink,
  MenuIcon,
  MenuItem,
  useDisclosure,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsFillPenFill, BsListUl } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { New, Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import {
  accountClassTypes,
  incomeBalanceTypes,
  type AccountCategory,
} from "~/modules/accounting";
import { useCustomColumns } from "~/hooks/useCustomColumns";
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

    const customColumns = useCustomColumns<AccountCategory>("accountCategory");

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      const defaultColumns: ColumnDef<(typeof data)[number]>[] = [
        {
          accessorKey: "category",
          header: "Category",
          cell: ({ row }) => (
            <Hyperlink onClick={() => navigate(row.original.id as string)}>
              {row.original.category}
            </Hyperlink>
          ),
        },
        {
          header: "Income/Balance",
          accessorKey: "incomeBalance",
          cell: (item) => <Enumerable value={item.getValue<string>()} />,
          meta: {
            filter: {
              type: "static",
              options: incomeBalanceTypes.map((incomeBalance) => ({
                value: incomeBalance,
                label: <Enumerable value={incomeBalance} />,
              })),
            },
            pluralHeader: "Income/Balance",
          },
        },
        {
          header: "Class",
          accessorKey: "class",
          cell: (item) => <Enumerable value={item.getValue<string>()} />,
          meta: {
            filter: {
              type: "static",
              options: accountClassTypes.map((accountClass) => ({
                value: accountClass,
                label: <Enumerable value={accountClass} />,
              })),
            },
            pluralHeader: "Income/Balance",
          },
        },

        {
          header: "Subcategories",
          cell: ({ row }) => (
            <Button
              variant="secondary"
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
          ),
        },
      ];
      return [...defaultColumns, ...customColumns];
    }, [navigate, params, customColumns]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        if (!row.id) return null;
        return (
          <>
            <MenuItem
              onClick={() => {
                navigate(
                  `${path.to.newAccountingSubcategory(
                    row.id!
                  )}${params?.toString()}`
                );
              }}
            >
              <MenuIcon icon={<BiAddToQueue />} />
              New Subcategory
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(
                  `${path.to.accountingCategoryList(
                    row.id!
                  )}?${params?.toString()}`
                );
              }}
            >
              <MenuIcon icon={<BsListUl />} />
              View Subcategories
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate(path.to.accountingCategory(row.id!));
              }}
            >
              <MenuIcon icon={<BsFillPenFill />} />
              Edit Account Category
            </MenuItem>
            <MenuItem
              disabled={!permissions.can("delete", "users")}
              onClick={() => onDelete(row)}
            >
              <MenuIcon icon={<IoMdTrash />} />
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
          primaryAction={
            permissions.can("update", "accounting") && (
              <New label="Account Category" to={`new?${params.toString()}`} />
            )
          }
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
