import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useUrlParams } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { ReceiptSourceDocument } from "~/modules/inventory/types";
import type { ListItem } from "~/types";

export default function useReceiptForm({
  sourceDocument,
  sourceDocumentId,
  setLocationId,
  setSourceDocument,
  setSourceDocumentId,
  setSupplierId,
}: {
  sourceDocument: ReceiptSourceDocument;
  sourceDocumentId: string | null;
  setLocationId: (locationId: string | null) => void;
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

  const fetchSourceDocument = useCallback(() => {
    if (!supabase) return;

    switch (sourceDocument) {
      case "Purchase Order":
        return supabase
          ?.from("purchase_order_view")
          .select("*")
          .eq("id", sourceDocumentId)
          .single()
          .then((response) => {
            if (response.error) {
              setError(response.error.message);
            } else {
              if (response.data) {
                setLocationId(response.data.locationId);
                setSupplierId(response.data.supplierId);
              }
            }
          });
      default:
    }
  }, [
    setLocationId,
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

  return {
    sourceDocuments,
    error,
  };
}
