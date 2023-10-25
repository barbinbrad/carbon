import { useCallback } from "react";
import { usePermissions } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  InventoryPostingGroup,
  PurchasingPostingGroup,
  SalesPostingGroup,
} from "~/modules/accounting";

export default function usePostingGroups(table: string) {
  const { supabase } = useSupabase();
  const permissions = usePermissions();

  const canEdit = permissions.can("update", "accounting");
  const canDelete = permissions.can("delete", "accounting");

  const onCellEdit = useCallback(
    async (
      id: string,
      value: unknown,
      row: PurchasingPostingGroup | SalesPostingGroup | InventoryPostingGroup
    ) => {
      if (!supabase) throw new Error("Supabase client not found");
      return await supabase
        .from(table)
        .update({
          [id]: value,
        })
        .eq("id", row.id);
    },
    [supabase, table]
  );

  return {
    canDelete,
    canEdit,
    supabase,
    onCellEdit,
  };
}
