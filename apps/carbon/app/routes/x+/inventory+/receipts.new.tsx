import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { upsertReceipt } from "~/modules/inventory";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    create: "inventory",
  });

  const nextSequence = await getNextSequence(client, "receipt", userId);
  if (nextSequence.error) {
    return redirect(
      request.headers.get("Referer") ?? "/x/inventory/receipts",
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const insertReceipt = await upsertReceipt(client, {
    receiptId: nextSequence.data,
    sourceDocumentId: "",
    createdBy: userId,
  });
  if (insertReceipt.error) {
    await rollbackNextSequence(client, "receipt", userId);
    return redirect(
      request.headers.get("Referer") ?? "/x/inventory/receipts",
      await flash(
        request,
        error(insertReceipt.error, "Failed to generate receipt")
      )
    );
  }

  return redirect(`/x/inventory/receipts/${insertReceipt.data.id}`);
}
