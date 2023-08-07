import { Checkbox } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { EditableNumber } from "~/components/Editable";
import { useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { receiptValidator } from "~/modules/inventory";
import type {
  ReceiptLine,
  ReceiptLineItem,
  ReceiptSourceDocument,
} from "~/modules/inventory/types";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";

export default function useReceiptForm({
  receipt,
  locations,
  sourceDocument,
  sourceDocumentId,
  setLocationId,
  setReceiptItems,
  setSourceDocument,
  setSourceDocumentId,
  setSupplierId,
}: {
  receipt: TypeOfValidator<typeof receiptValidator>;
  locations: ListItem[];
  sourceDocument: ReceiptSourceDocument;
  sourceDocumentId: string | null;
  setLocationId: (locationId: string | null) => void;
  setReceiptItems: (receiptLines: ReceiptLine[]) => void;
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

  const deleteReceiptItems = useCallback(async () => {
    if (!supabase) throw new Error("supabase client is not defined");

    return supabase
      .from("receiptLine")
      .delete()
      .eq("receiptId", receipt.receiptId);
  }, [receipt.receiptId, supabase]);

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

    switch (sourceDocument) {
      case "Purchase Order":
        const [purchaseOrder, purchaseOrderLines, receiptLines] =
          await Promise.all([
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
            supabase
              .from("receiptLine")
              .select("*")
              .eq("receiptId", receipt.receiptId),
          ]);

        if (purchaseOrder.error) {
          setError(purchaseOrder.error.message);
          setReceiptItems([]);
          break;
        } else {
          setLocationId(purchaseOrder.data.locationId);
          setSupplierId(purchaseOrder.data.supplierId);
        }

        if (receiptLines.error) {
          setError(receiptLines.error.message);
          setReceiptItems([]);
          break;
        }

        if (
          receipt.sourceDocumentId === sourceDocumentId &&
          receiptLines.data.length > 0
        ) {
          // no need to insert and fetch lines if they already exist
          setReceiptItems(receiptLines.data);
          break;
        }

        const deleteExistingLines = await deleteReceiptItems();
        if (deleteExistingLines.error) {
          setError(deleteExistingLines.error.message);
          break;
        }

        if (purchaseOrderLines.error) {
          setError(purchaseOrderLines.error.message);
          break;
        }

        const receiptLineItems = purchaseOrderLines.data.reduce<
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
            receiptId: receipt.receiptId,
            lineId: d.id,
            partId: d.partId,
            orderQuantity: d.purchaseQuantity,
            receivedQuantity: 0,
            unitPrice: d.unitPrice,
            unitOfMeasure: d.unitOfMeasureCode ?? "EA",
            locationId: purchaseOrder.data.locationId,
            shelfId: d.shelfId,
            receivedComplete: false,
            createdBy: user?.id ?? "",
          });

          return acc;
        }, []);

        const { error: insertError } = await supabase
          .from("receiptLine")
          .insert(receiptLineItems);

        if (insertError) {
          setError(insertError.message);
          setReceiptItems([]);
          break;
        }

        const { data: receiptLinesData, error: selectError } = await supabase
          .from("receiptLine")
          .select("*")
          .eq("receiptId", receipt.receiptId);

        if (selectError) {
          setError(selectError.message);
          setReceiptItems([]);
          break;
        }

        setReceiptItems(receiptLinesData ?? []);
        break;
      default:
        return;
    }
  }, [
    deleteReceiptItems,
    receipt.receiptId,
    receipt.sourceDocumentId,
    setLocationId,
    setReceiptItems,
    setSupplierId,
    sourceDocument,
    sourceDocumentId,
    supabase,
    user?.id,
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

  const receiptItemColumns = useMemo<ColumnDef<ReceiptLine>[]>(() => {
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

  const handleCellEdit = useCallback(
    async (id: string, value: unknown, row: ReceiptLine) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("receiptLine")
        .update({
          [id]: value,
        })
        .eq("id", row.id);
    },
    [supabase]
  );

  const receiptItemEditableComponents = useMemo(
    () => ({
      receivedQuantity: EditableNumber(handleCellEdit),
      unitPrice: EditableNumber(handleCellEdit),
    }),
    [handleCellEdit]
  );

  return {
    deleteReceipt,
    editableComponents: receiptItemEditableComponents,
    error,
    receiptItemColumns,
    sourceDocuments,
  };
}
