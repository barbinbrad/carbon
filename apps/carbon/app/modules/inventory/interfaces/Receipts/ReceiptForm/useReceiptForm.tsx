import { Checkbox } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  ReceiptLineItem,
  ReceiptSourceDocument,
} from "~/modules/inventory/types";
import type { ListItem } from "~/types";

export default function useReceiptForm({
  receiptId,
  locations,
  sourceDocument,
  sourceDocumentId,
  setLocationId,
  setReceiptItems,
  setSourceDocument,
  setSourceDocumentId,
  setSupplierId,
}: {
  receiptId: string;
  locations: ListItem[];
  sourceDocument: ReceiptSourceDocument;
  sourceDocumentId: string | null;
  setLocationId: (locationId: string | null) => void;
  setReceiptItems: (receiptItems: ReceiptLineItem[]) => void;
  setSourceDocument: (sourceDocument: ReceiptSourceDocument) => void;
  setSourceDocumentId: (sourceDocumentId: string | null) => void;
  setSupplierId: (supplierId: string | null) => void;
}) {
  const user = useUser();
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

  // TODO: this should call an API method that uses the service role to delete the receipt after
  //      checking that it is not posted or received
  const deleteReceipt = useCallback(
    (id: string) => {
      if (!supabase) return;

      return supabase
        .from("receipt")
        .delete()
        .eq("id", id)
        .then((response) => {
          if (response.error) {
            setError(response.error.message);
          }
        });
    },
    [supabase]
  );

  const deleteReceiptLines = useCallback(async () => {
    if (!supabase) throw new Error("supabase client is not defined");

    return supabase.from("receiptLine").delete().eq("receiptId", receiptId);
  }, [receiptId, supabase]);

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
    if (!supabase || !sourceDocumentId) return;

    const deleteExistingLines = await deleteReceiptLines();
    if (deleteExistingLines.error) {
      setError(deleteExistingLines.error.message);
      return;
    }

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
            .eq("purchaseOrderLineType", "Part")
            .eq("receivedComplete", false),
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
          const receiptItems = purchaseOrderLines.data.reduce<
            ReceiptLineItem[]
          >((acc, d) => {
            if (
              !d.partId ||
              !d.purchaseQuantity ||
              d.unitPrice === null ||
              isNaN(d.unitPrice)
            ) {
              return acc;
            }

            acc.push({
              receiptId,
              partId: d.partId,
              orderQuantity: d.purchaseQuantity,
              receivedQuantity: 0,
              unitPrice: d.unitPrice,
              unitOfMeasure: d.unitOfMeasureCode ?? "EA",
              locationId: purchaseOrder.data.locationId,
              shelfId: d.shelfId,
              receivedComplete: false,
            });

            return acc;
          }, []);

          setReceiptItems(receiptItems);
          supabase
            .from("receiptLine")
            .insert(receiptItems.map((r) => ({ ...r, createdBy: user.id })))
            .then((response) => {
              if (response.error) {
                setError(response.error.message);
                setReceiptItems([]);
              }
            });
        }

        break;
      default:
        return;
    }
  }, [
    deleteReceiptLines,
    receiptId,
    setLocationId,
    setReceiptItems,
    setSupplierId,
    sourceDocument,
    sourceDocumentId,
    supabase,
    user.id,
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

  const receiptItemColumns = useMemo<ColumnDef<ReceiptLineItem>[]>(() => {
    return [
      {
        accessorKey: "partId",
        header: "Part",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "orderQuantity",
        header: "Order Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "receivedQuantity",
        header: "Received Quantity",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "unitPrice",
        header: "Unit Cost",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "locationId",
        header: "Location",
        cell: ({ row }) =>
          locations.find((l) => l.id === row.original.locationId)?.name ?? null,
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
      {
        accessorKey: "receivedComplete",
        header: "Received Complete",
        cell: (item) => (
          <Checkbox isChecked={item.getValue<boolean>()} readOnly />
        ),
      },
    ];
  }, [locations]);

  return {
    deleteReceipt,
    error,
    receiptItemColumns,
    sourceDocuments,
  };
}
