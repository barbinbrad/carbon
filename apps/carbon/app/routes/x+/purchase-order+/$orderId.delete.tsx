import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { deletePurchaseOrder } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw notFound("orderId not found");

  const remove = await deletePurchaseOrder(client, orderId);

  if (remove.error) {
    return redirect(
      "/x/documents/search",
      await flash(
        request,
        error(remove.error, "Failed to delete purchase order")
      )
    );
  }

  return json(null);
}
