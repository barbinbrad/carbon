import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type { PartSupplier } from "~/modules/parts";

export default function usePartSuppliers() {
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "parts");
  const canDelete = permissions.can("delete", "parts");

  const onCellEdit = useCallback(
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
    canDelete,
    canEdit,
    supabase,
    onCellEdit,
  };
}
