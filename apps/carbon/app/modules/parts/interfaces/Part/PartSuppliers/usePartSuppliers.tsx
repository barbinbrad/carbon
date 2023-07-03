import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useMemo } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { getUnitOfMeasuresList } from "~/modules/parts";
import type { getSuppliersList } from "~/modules/purchasing";
import type { PartSupplier } from "~/modules/parts";

export default function usePartSuppliers() {
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "parts");
  const canDelete = permissions.can("delete", "parts");

  const suppliersFetcher =
    useFetcher<Awaited<ReturnType<typeof getSuppliersList>>>();
  const uomFetcher =
    useFetcher<Awaited<ReturnType<typeof getUnitOfMeasuresList>>>();

  useEffect(() => {
    if (suppliersFetcher.type === "init") {
      suppliersFetcher.load("/api/purchasing/suppliers");
    }
  }, [suppliersFetcher]);

  useEffect(() => {
    if (uomFetcher.type === "init") {
      uomFetcher.load("/api/parts/uom");
    }
  }, [uomFetcher]);

  const supplierOptions = useMemo(
    () =>
      suppliersFetcher.data?.data
        ? suppliersFetcher.data?.data.map((p) => ({
            value: p.id,
            label: p.id,
          }))
        : [],
    [suppliersFetcher.data]
  );

  const unitOfMeasureOptions = useMemo(
    () =>
      uomFetcher.data?.data
        ? uomFetcher.data?.data.map((c) => ({
            value: c.code,
            label: c.code,
          }))
        : [],
    [uomFetcher.data]
  );

  const handleCellEdit = useCallback(
    async (id: string, value: unknown, row: PartSupplier) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from("partSupplier")
        .update({
          [id]: value,
        })
        .eq("id", row.id);
    },
    [supabase]
  );

  return {
    unitOfMeasureOptions,
    canDelete,
    canEdit,
    supplierOptions,
    supabase,
    handleCellEdit,
  };
}
