import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useUrlParams } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  ReceiptListItem,
  ReceiptSourceDocument,
} from "~/modules/inventory/types";
import type { ListItem } from "~/types";

export default function useReceiptForm({
  locations,
  sourceDocument,
  sourceDocumentId,
  setLocationId,
  setReceiptItems,
  setSourceDocument,
  setSourceDocumentId,
  setSupplierId,
}: {
  locations: ListItem[];
  sourceDocument: ReceiptSourceDocument;
  sourceDocumentId: string | null;
  setLocationId: (locationId: string | null) => void;
  setReceiptItems: (receiptItems: ReceiptListItem[]) => void;
  setSourceDocument: (sourceDocument: ReceiptSourceDocument) => void;
  setSourceDocumentId: (sourceDocumentId: string | null) => void;
  setSupplierId: (supplierId: string | null) => void;
}) {
  const [sourceDocuments, setSourceDocuments] = useState<ListItem[]>([]);
  const [params] = useUrlParams();
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const sourceDocumentIdFromParams = params.get("sourceDocumentId");
  const sourceDocumentFromParams = params.get("sourceDocument");

  useEffect(() => {
    if (sourceDocumentIdFromParams && sourceDocumentFromParams) {
      flushSync(() => {
        setSourceDocument(sourceDocumentFromParams as ReceiptSourceDocument);
      });

      setSourceDocumentId(sourceDocumentIdFromParams);
    }
  }, [
    setSourceDocument,
    setSourceDocumentId,
    sourceDocumentFromParams,
    sourceDocumentIdFromParams,
  ]);

  const fetchSourceDocuments = useCallback(() => {
    if (!supabase) return;

    switch (sourceDocument) {
      case "Purchase Order":
        return supabase
          ?.from("purchaseOrder")
          .select("id, purchaseOrderId")
          .eq("released", true)
          .then((response) => {
            if (response.error) {
              setError(response.error.message);
            } else {
              setSourceDocuments(
                response.data.map((d) => ({
                  name: d.purchaseOrderId,
                  id: d.id,
                }))
              );
            }
          });

      default:
        setSourceDocuments([]);
    }
  }, [sourceDocument, supabase]);

  const fetchSourceDocument = useCallback(async () => {
    if (!supabase) return;

    switch (sourceDocument) {
      case "Purchase Order":
        const [purchaseOrder, purchaseOrderLines] = await Promise.all([
          supabase
            .from("purchase_order_view")
            .select("*")
            .eq("id", sourceDocumentId)
            .single(),
          supabase
            .from("purchaseOrderLine")
            .select("*")
            .eq("purchaseOrderId", sourceDocumentId)
            .eq("purchaseOrderLineType", "Part"),
        ]);

        if (purchaseOrder.error) {
          setError(purchaseOrder.error.message);
          break;
        } else {
          setLocationId(purchaseOrder.data.locationId);
          setSupplierId(purchaseOrder.data.supplierId);
        }

        if (purchaseOrderLines.error) {
          setError(purchaseOrderLines.error.message);
        } else {
          setReceiptItems(
            purchaseOrderLines.data.reduce<ReceiptListItem[]>((acc, d) => {
              if (
                !d.partId ||
                !d.description ||
                !d.purchaseQuantity ||
                !d.unitPrice
              ) {
                return acc;
              }

              acc.push({
                partId: d.partId,
                description: d.description,
                quantity: d.purchaseQuantity,
                unitCost: d.unitPrice,
                unitOfMeasure: d.unitOfMeasureCode ?? "EA",
                location: purchaseOrder.data.locationId ?? undefined,
                shelfId: d.shelfId ?? undefined,
              });

              return acc;
            }, [])
          );
        }

        break;
      default:
        return;
    }
  }, [
    setLocationId,
    setReceiptItems,
    setSupplierId,
    sourceDocument,
    sourceDocumentId,
    supabase,
  ]);

  useEffect(() => {
    fetchSourceDocuments();
  }, [fetchSourceDocuments, sourceDocument]);

  useEffect(() => {
    if (sourceDocumentId) {
      fetchSourceDocument();
    } else {
      setLocationId(null);
      setSupplierId(null);
    }
  }, [fetchSourceDocument, setLocationId, setSupplierId, sourceDocumentId]);

  const receiptItemColumns = useMemo<ColumnDef<ReceiptListItem>[]>(() => {
    return [
      {
        accessorKey: "partId",
        header: "Part",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitCost",
        header: "Unit Cost",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) =>
          locations.find((l) => l.id === row.original.location)?.name ?? null,
      },
      {
        accessorKey: "shelfId",
        header: "Shelf",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitOfMeasure",
        header: "Unit of Measure",
        cell: (item) => item.getValue(),
      },
    ];
  }, [locations]);

  return {
    receiptItemColumns,
    sourceDocuments,
    error,
  };
}
