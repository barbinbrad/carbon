import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { useUser } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  PurchaseOrder,
  PurchaseOrderTransactionType,
} from "~/modules/purchasing";
import { path } from "~/utils/path";

export const usePurchaseOrder = () => {
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
      navigate(path.to.purchaseOrder(purchaseOrder.id!)),
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

  const invoice = useCallback(
    (purchaseOrder: PurchaseOrder) =>
      navigate(
        `${path.to.newPurchaseInvoice}?sourceDocument=Purchase Order&sourceDocumentId=${purchaseOrder.id}`
      ),
    [navigate]
  );

  const receive = useCallback(
    (purchaseOrder: PurchaseOrder) =>
      navigate(
        `${path.to.newReceipt}?sourceDocument=Purchase Order&sourceDocumentId=${purchaseOrder.id}`
      ),
    [navigate]
  );

  return {
    edit,
    favorite,
    invoice,
    receive,
  };
};
