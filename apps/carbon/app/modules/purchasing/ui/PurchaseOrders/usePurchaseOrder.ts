import { useNavigate, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  PurchaseOrder,
  PurchaseOrderTransactionType,
} from "~/modules/purchasing";

export const usePurchaseOrder = () => {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const user = useUser();

  const insertTransaction = useCallback(
    (purchaseOrder: PurchaseOrder, type: PurchaseOrderTransactionType) => {
      if (user?.id === undefined) throw new Error("User is undefined");
      if (!purchaseOrder.id) throw new Error("Purchase order ID is undefined");
      return supabase?.from("purchaseOrderTransaction").insert({
        purchaseOrderId: purchaseOrder.id,
        type,
        userId: user.id,
      });
    },
    [supabase, user?.id]
  );

  const edit = useCallback(
    (purchaseOrder: PurchaseOrder) =>
      navigate(`/x/purchase-order/${purchaseOrder.id}`),
    [navigate]
  );

  const favorite = useCallback(
    async (purchaseOrder: PurchaseOrder) => {
      if (!purchaseOrder.id) throw new Error("Purchase order ID is undefined");
      if (purchaseOrder.favorite) {
        await supabase
          ?.from("purchaseOrderFavorite")
          .delete()
          .eq("purchaseOrderId", purchaseOrder.id)
          .eq("userId", user?.id);
        return insertTransaction(purchaseOrder, "Unfavorite");
      } else {
        await supabase
          ?.from("purchaseOrderFavorite")
          .insert({ purchaseOrderId: purchaseOrder.id, userId: user?.id });
        return insertTransaction(purchaseOrder, "Favorite");
      }
    },
    [insertTransaction, supabase, user?.id]
  );

  const receive = useCallback(
    (purchaseOrder: PurchaseOrder) =>
      navigate(
        `/x/inventory/receipts/new?sourceDocument=Purchase Order&sourceDocumentId=${purchaseOrder.id}`
      ),
    [navigate]
  );

  const release = useCallback(
    async (purchaseOrder: PurchaseOrder) => {
      if (!purchaseOrder.id) throw new Error("Purchase order ID is undefined");
      if (!supabase) throw new Error("Supabase is undefined");

      const { error } = await supabase
        .from("purchaseOrder")
        .update({
          status: "To Receive and Invoice",
        })
        .eq("id", purchaseOrder.id);

      if (!error) {
        submit(`/x/purchase-order/${purchaseOrder.id}`, {
          method: "post",
        });
      }
    },
    [submit, supabase]
  );

  return {
    edit,
    favorite,
    receive,
    release,
  };
};
