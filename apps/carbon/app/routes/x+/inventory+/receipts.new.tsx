import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSupabaseServiceRole } from "~/lib/supabase";
import type { ReceiptSourceDocument } from "~/modules/inventory";
import { upsertReceipt } from "~/modules/inventory";
import { getPurchaseOrder } from "~/modules/purchasing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { getUserDefaults } from "~/modules/users/users.server";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    create: "inventory",
  });

  const url = new URL(request.url);
  const sourceDocument =
    (url.searchParams.get("sourceDocument") as ReceiptSourceDocument) ??
    undefined;
  const sourceDocumentId = url.searchParams.get("sourceDocumentId") ?? "";

  const [nextSequence, defaults] = await Promise.all([
    getNextSequence(client, "receipt", userId),
    getUserDefaults(client, userId),
  ]);
  if (nextSequence.error) {
    return redirect(
      request.headers.get("Referer") ?? path.to.receipts,
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  let sourceDocumentReadableId: string | undefined;
  if (sourceDocument) {
    const serviceRole = getSupabaseServiceRole();
    switch (sourceDocument) {
      case "Purchase Order":
        const purchaseOrder = await getPurchaseOrder(
          serviceRole,
          sourceDocumentId
        );
        if (purchaseOrder.data) {
          sourceDocumentReadableId =
            purchaseOrder.data.purchaseOrderId ?? undefined;
        }
        break;
      default:
        break;
    }
  }

  const insertReceipt = await upsertReceipt(client, {
    receiptId: nextSequence.data,
    // @ts-expect-error
    sourceDocument,
    sourceDocumentId,
    sourceDocumentReadableId,
    locationId: defaults.data?.locationId ?? undefined,
    createdBy: userId,
  });
  if (insertReceipt.error) {
    await rollbackNextSequence(client, "receipt", userId);
    return redirect(
      request.headers.get("Referer") ?? path.to.receipts,
      await flash(
        request,
        error(insertReceipt.error, "Failed to generate receipt")
      )
    );
  }

  return redirect(path.to.receipt(insertReceipt.data.id));
}
