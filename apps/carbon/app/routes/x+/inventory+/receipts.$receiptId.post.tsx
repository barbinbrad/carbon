import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSupabaseServiceRole } from "~/lib/supabase";
import { ReceiptPostModal } from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  await requirePermissions(request, {
    update: "inventory",
  });

  const client = getSupabaseServiceRole();

  const { receiptId } = params;
  if (!receiptId) throw new Error("receiptId not found");

  const formData = await request.formData();

  switch (formData.get("intent")) {
    case "receive":
      const post = await client.functions.invoke("post-receipt", {
        body: {
          receiptId,
        },
      });

      if (post.error) {
        return redirect(
          `/x/inventory/receipts`,
          await flash(request, error("Failed to post receipt"))
        );
      }

      return redirect(
        `/x/inventory/receipts`,
        await flash(request, success("Successfully posted receipt"))
      );
    default:
      break;
  }

  return redirect(`/x/inventory/receipts`);
}

export default function ReceiptPostRoute() {
  return <ReceiptPostModal />;
}
