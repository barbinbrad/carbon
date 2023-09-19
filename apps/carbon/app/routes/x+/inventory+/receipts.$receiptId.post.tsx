import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReceiptPostModal } from "~/modules/inventory";
import { postingQueue, PostingQueueType } from "~/queues";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "inventory",
  });

  const { receiptId } = params;
  if (!receiptId) throw new Error("receiptId not found");

  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "receive":
      const setPendingState = await client
        .from("receipt")
        .update({
          status: "Pending",
        })
        .eq("id", receiptId);

      if (setPendingState.error) {
        return redirect(
          `/x/inventory/receipts`,
          await flash(
            request,
            error(setPendingState.error, "Failed to post receipt")
          )
        );
      }

      postingQueue.add(`posting receipt ${receiptId}`, {
        type: PostingQueueType.Receipt,
        documentId: receiptId,
      });

      return redirect(`/x/inventory/receipts`);
    default:
      break;
  }

  return redirect(`/x/inventory/receipts`);
}

export default function ReceiptPostRoute() {
  return <ReceiptPostModal />;
}
