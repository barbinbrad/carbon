import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditableNumber } from "~/components/Editable";
import { usePermissions, useRouteData, useUrlParams, useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { receiptValidator } from "~/modules/inventory";
import type {
  ReceiptLine,
  ReceiptLineItem,
  ReceiptSourceDocument,
} from "~/modules/inventory/types";
import type { PurchaseOrderLine } from "~/modules/purchasing";
import type { ListItem } from "~/types";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

export default function useReceiptForm({
  receipt,
  receiptLines,
}: {
  receipt: TypeOfValidator<typeof receiptValidator>;
  receiptLines: ReceiptLine[];
}) {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const user = useUser();
  const [params] = useUrlParams();
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const isDisabled = !permissions.can("update", "inventory");

  const routeData = useRouteData<{
    locations: ListItem[];
  }>(path.to.receipts);

  const [internalReceiptLines, setReceiptLines] = useState<ReceiptLine[]>(
    receiptLines ?? []
  );
  const canPost =
    internalReceiptLines.length > 0 &&
    internalReceiptLines.some((l) => l.receivedQuantity > 0);

  const [locationId, setLocationId] = useState<string | null>(
    receipt.locationId ?? user.defaults.locationId ?? null
  );
  const [supplierId, setSupplierId] = useState<string | null>(
    receipt.supplierId ?? null
  );

  const [sourceDocuments, setSourceDocuments] = useState<ListItem[]>([]);
  const [sourceDocument, setSourceDocument] = useState<ReceiptSourceDocument>(
    receipt.sourceDocument ?? "Purchase Order"
  );

  const [sourceDocumentId, setSourceDocumentId] = useState<string | null>(
    receipt.sourceDocumentId ?? null
  );

  const onClose = async () => {
    if (
      internalReceiptLines.length === 0 ||
      internalReceiptLines.every((line) => line.receivedQuantity === 0)
    ) {
      await deleteReceipt();
    }

    navigate(path.to.receipts);
  };

  const onPost = () => {
    navigate(path.to.receiptPost(receipt.id));
  };

  const sourceDocumentIdFromParams = params.get("sourceDocumentId");
  const sourceDocumentFromParams = params.get("sourceDocument");

  useEffect(() => {
    if (sourceDocumentIdFromParams && sourceDocumentFromParams) {
      setSourceDocument(sourceDocumentFromParams as ReceiptSourceDocument);
      setSourceDocumentId(sourceDocumentIdFromParams);
    }
  }, [
    setSourceDocument,
    setSourceDocumentId,
    sourceDocumentFromParams,
    sourceDocumentIdFromParams,
  ]);

  //  TODO: verify that it is not posted or received
  const deleteReceipt = useCallback(async () => {
    if (!supabase) return;

    try {
      await fetch(path.to.api.rollback("receipt", receipt.receiptId), {
        method: "DELETE",
      })
        .then(() => console.log("successfully rolled back receipt sequence"))
        .catch(console.error);

      await supabase
        .from("receipt")
        .delete()
        .eq("receiptId", receipt.receiptId);
    } catch {
      setError("Failed to delete receipt");
    }
  }, [receipt.receiptId, supabase]);

  const deleteReceiptLines = useCallback(async () => {
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
        supabase
          ?.from("purchaseOrder")
          .select("id, purchaseOrderId")
          .or("status.eq.To Receive, status.eq.To Receive and Invoice")
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
        const [
          purchaseOrder,
          receiptLines,
          previouslyReceivedLines,
          purchaseOrderLines,
        ] = await Promise.all([
          supabase
            .from("purchaseOrders")
            .select("*")
            .eq("id", sourceDocumentId)
            .single(),

          supabase
            .from("receiptLine")
            .select("*")
            .eq("receiptId", receipt.receiptId),
          supabase
            .from("receiptQuantityReceivedByLine")
            .select("*")
            .eq("sourceDocumentId", sourceDocumentId),
          locationId
            ? supabase
                .from("purchaseOrderLine")
                .select("*")
                .eq("purchaseOrderId", sourceDocumentId)
                .eq("purchaseOrderLineType", "Part")
                .eq("locationId", locationId)
            : Promise.resolve({ data: [] as PurchaseOrderLine[], error: null }),
        ]);

        if (purchaseOrder.error) {
          setError(purchaseOrder.error.message);
          setReceiptLines([]);
          break;
        } else {
          setSupplierId(purchaseOrder.data.supplierId);
        }

        if (receiptLines.error) {
          setError(receiptLines.error.message);
          setReceiptLines([]);
          break;
        }

        if (
          receipt.sourceDocumentId === sourceDocumentId &&
          receiptLines.data.length > 0
        ) {
          // no need to insert and fetch lines if they already exist
          setReceiptLines(receiptLines.data);
          break;
        }

        const deleteExistingLines = await deleteReceiptLines();
        if (deleteExistingLines.error) {
          setError(deleteExistingLines.error.message);
          break;
        }

        if (purchaseOrderLines.error) {
          setError(purchaseOrderLines.error.message);
          break;
        }

        const previouslyReceivedQuantitiesByLine = (
          previouslyReceivedLines.data ?? []
        ).reduce<Record<string, number>>((acc, d) => {
          if (d.lineId) acc[d.lineId] = d.receivedQuantity ?? 0;
          return acc;
        }, {});

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

          const outstandingQuantity =
            d.purchaseQuantity -
            (previouslyReceivedQuantitiesByLine[d.id] ?? 0);

          acc.push({
            receiptId: receipt.receiptId,
            lineId: d.id,
            partId: d.partId,
            orderQuantity: d.purchaseQuantity,
            outstandingQuantity,
            receivedQuantity: outstandingQuantity,
            unitPrice: d.unitPrice,
            unitOfMeasure: d.unitOfMeasureCode ?? "EA",
            locationId: d.locationId,
            shelfId: d.shelfId,
            createdBy: user?.id ?? "",
          });

          return acc;
        }, []);

        const { error: insertError } = await supabase
          .from("receiptLine")
          .insert(receiptLineItems);

        if (insertError) {
          setError(insertError.message);
          setReceiptLines([]);
          break;
        }

        const { data: receiptLinesData, error: selectError } = await supabase
          .from("receiptLine")
          .select("*")
          .eq("receiptId", receipt.receiptId);

        if (selectError) {
          setError(selectError.message);
          setReceiptLines([]);
          break;
        }

        setReceiptLines(receiptLinesData ?? []);
        break;
      default:
        return;
    }
  }, [
    deleteReceiptLines,
    locationId,
    receipt.receiptId,
    receipt.sourceDocumentId,
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
      setSupplierId(null);
    }
  }, [fetchSourceDocument, setLocationId, setSupplierId, sourceDocumentId]);

  const receiptLineColumns = useMemo<ColumnDef<ReceiptLine>[]>(() => {
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
        accessorKey: "outstandingQuantity",
        header: "Outstanding Quantity",
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
          (routeData?.locations ?? []).find(
            (l) => l.id === row.original.locationId
          )?.name ?? null,
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
  }, [routeData?.locations]);

  const onCellEdit = useCallback(
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

  const receiptLineEditableComponents = useMemo(
    () => ({
      receivedQuantity: EditableNumber(onCellEdit),
    }),
    [onCellEdit]
  );

  return {
    editableComponents: receiptLineEditableComponents,
    error,
    locationId,
    locations: routeData?.locations ?? [],
    internalReceiptLines,
    canPost,
    isDisabled,
    receiptLineColumns,
    sourceDocument,
    sourceDocumentId,
    supplierId,
    sourceDocuments,
    onClose,
    onPost,
    setLocationId,
    setSourceDocument,
    setSourceDocumentId,
  };
}
