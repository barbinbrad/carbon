import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReceiptPostModal } from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  await requirePermissions(request, {
    update: "inventory",
  });

  const { receiptId } = params;
  if (!receiptId) throw new Error("receiptId not found");

  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "receive":
      console.log("posting receipt receive only");
      break;
    case "receiveAndInvoice":
      console.log("posting receipt receive and invoice");
      break;
    default:
      break;
  }

  return redirect(
    `/x/inventory/receipts`,
    await flash(request, success("Successfully posted receipt"))
  );
}

export default function ReceiptPostRoute() {
  return <ReceiptPostModal />;
}
