import {
  HStack,
  Hyperlink,
  MenuIcon,
  MenuItem,
  useDisclosure,
} from "@carbon/react";
import { useFetcher, useFetchers, useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, useState } from "react";
import { BsFillPenFill, BsPin, BsPinFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions } from "~/hooks";
import { type Quotation, type quoteStatusType } from "~/modules/sales";
import { favoriteSchema } from "~/types/validators";
import { path } from "~/utils/path";
import { QuotationStatus } from "../Quotation";
// import { QuotationStatus } from "~/modules/purchasing";

type QuotationsTableProps = {
  data: Quotation[];
  count: number;
};

const QuotationsTable = memo(({ data, count }: QuotationsTableProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const optimisticFavorite = useOptimisticFavorite();

  const rows = useMemo<Quotation[]>(
    () =>
      data.map((d) =>
        d.id === optimisticFavorite?.id
          ? {
              ...d,
              favorite: optimisticFavorite?.favorite
                ? optimisticFavorite.favorite === "favorite"
                : d.favorite,
            }
          : d
      ),
    [data, optimisticFavorite]
  );

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const deleteQuotationModal = useDisclosure();

  const columns = useMemo<ColumnDef<Quotation>[]>(() => {
    return [
      {
        accessorKey: "quoteId",
        header: "Quote Number",
        cell: ({ row }) => (
          <HStack>
            {row.original.favorite ? (
              <fetcher.Form
                method="post"
                action={path.to.quoteFavorite}
                className="flex items-center"
              >
                <input type="hidden" name="id" value={row.original.id!} />
                <input type="hidden" name="favorite" value="unfavorite" />
                <button type="submit">
                  <BsPinFill
                    className="text-yellow-400 cursor-pointer h-4 w-4"
                    type="submit"
                  />
                </button>
              </fetcher.Form>
            ) : (
              <fetcher.Form
                method="post"
                action={path.to.quoteFavorite}
                className="flex items-center"
              >
                <input type="hidden" name="id" value={row.original.id!} />
                <input type="hidden" name="favorite" value="favorite" />
                <button type="submit">
                  <BsPin
                    className="text-yellow-400 cursor-pointer h-4 w-4"
                    type="submit"
                  />
                </button>
              </fetcher.Form>
            )}
            <Hyperlink
              onClick={() => navigate(path.to.quote(row.original.id!))}
            >
              {row.original.quoteId}
            </Hyperlink>
          </HStack>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Customer",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (item) => {
          if (item.getValue<string>()) {
            return item.getValue<string>().substring(0, 50);
          }
          return null;
        },
      },
      {
        accessorKey: "partIds",
        header: "Parts",
        cell: (item) => item.getValue<string[]>()?.filter(Boolean)?.length ?? 0,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (item) => {
          const status = item.getValue<(typeof quoteStatusType)[number]>();
          return <QuotationStatus status={status} />;
        },
      },
      {
        accessorKey: "quoteDate",
        header: "Quote Date",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "expirationDate",
        header: "Expiration Date",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "locationName",
        header: "Location",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "customerReference",
        header: "Customer Reference",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "createdByFullName",
        header: "Created By",
        cell: ({ row }) => {
          return (
            <HStack>
              <Avatar size="sm" path={row.original.createdByAvatar} />
              <p>{row.original.createdByFullName}</p>
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
              <p>{row.original.updatedByFullName}</p>
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
  }, [fetcher, navigate]);

  const defaultColumnVisibility = {
    expirationDate: false,
    quoteDate: false,
    customerReference: false,
    locationName: false,
    createdAt: false,
    createdByFullName: false,
    updatedAt: false,
    updatedByFullName: false,
  };

  const renderContextMenu = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return (row: Quotation) => (
      <>
        <MenuItem onClick={() => navigate(path.to.quote(row.id!))}>
          <MenuIcon icon={<BsFillPenFill />} />
          Edit
        </MenuItem>
        <MenuItem
          disabled={!permissions.can("delete", "purchasing")}
          onClick={() => {
            setSelectedQuotation(row);
            deleteQuotationModal.onOpen();
          }}
        >
          <MenuIcon icon={<IoMdTrash />} />
          Delete
        </MenuItem>
      </>
    );
  }, [deleteQuotationModal, navigate, permissions]);

  return (
    <>
      <Table<Quotation>
        count={count}
        columns={columns}
        data={rows}
        defaultColumnVisibility={defaultColumnVisibility}
        withColumnOrdering
        withFilters
        withPagination
        withSimpleSorting
        renderContextMenu={renderContextMenu}
      />
      {selectedQuotation && selectedQuotation.id && (
        <ConfirmDelete
          action={path.to.deleteQuote(selectedQuotation.id)}
          isOpen={deleteQuotationModal.isOpen}
          name={selectedQuotation.quoteId!}
          text={`Are you sure you want to delete ${selectedQuotation.quoteId!}? This cannot be undone.`}
          onCancel={() => {
            deleteQuotationModal.onClose();
            setSelectedQuotation(null);
          }}
          onSubmit={() => {
            deleteQuotationModal.onClose();
            setSelectedQuotation(null);
          }}
        />
      )}
    </>
  );
});

QuotationsTable.displayName = "QuotationsTable";

export default QuotationsTable;

function useOptimisticFavorite() {
  const fetchers = useFetchers();
  const favoriteFetcher = fetchers.find(
    (f) => f.formAction === path.to.quoteFavorite
  );

  if (favoriteFetcher && favoriteFetcher.formData) {
    const id = favoriteFetcher.formData.get("id");
    const favorite = favoriteFetcher.formData.get("favorite") ?? "off";
    const submission = favoriteSchema.safeParse({ id, favorite });
    if (submission.success) {
      return submission.data;
    }
  }
}
