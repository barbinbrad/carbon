import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useMemo } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { getAccountsList } from "~/modules/accounting";
import type { getPartsList } from "~/modules/parts";
import type { PurchaseOrderLine } from "~/modules/purchasing";

export default function usePurchaseOrderLines() {
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "purchasing");
  const canDelete = permissions.can("delete", "purchasing");

  const partsFetcher = useFetcher<Awaited<ReturnType<typeof getPartsList>>>();
  const accountsFetcher =
    useFetcher<Awaited<ReturnType<typeof getAccountsList>>>();

  useEffect(() => {
    partsFetcher.load("/api/parts/list?replenishmentSystem=Buy");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    accountsFetcher.load("/api/accounting/accounts?type=Posting");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partOptions = useMemo(
    () =>
      partsFetcher.data?.data
        ? partsFetcher.data?.data.map((p) => ({
            value: p.id,
            label: p.id,
          }))
        : [],
    [partsFetcher.data]
  );

  const accountOptions = useMemo(
    () =>
      accountsFetcher.data?.data
        ? accountsFetcher.data?.data.map((c) => ({
            value: c.number,
            label: c.number,
          }))
        : [],
    [accountsFetcher.data]
  );

  const handleCellEdit = useCallback(
    async (id: string, value: unknown, row: PurchaseOrderLine) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("purchaseOrderLine")
        .update({
          [id]: value,
        })
        .eq("id", row.id);
    },
    [supabase]
  );

  return {
    accountOptions,
    canDelete,
    canEdit,
    partOptions,
    supabase,
    handleCellEdit,
  };
}
