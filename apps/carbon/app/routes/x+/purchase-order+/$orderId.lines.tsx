import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getPurchaseOrderLines,
  PurchaseOrderLines,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const [purchaseOrderLines] = await Promise.all([
    getPurchaseOrderLines(client, orderId),
  ]);

  if (purchaseOrderLines.error) {
    return redirect(
      `/x/purchase-order/${orderId}`,
      await flash(
        request,
        error(purchaseOrderLines.error, "Failed to load purchase order lines")
      )
    );
  }

  return json({
    purchaseOrderLines: purchaseOrderLines.data ?? [],
  });
}

export default function PurchaseOrderLinesRoute() {
  const { purchaseOrderLines } = useLoaderData<typeof loader>();

  return <PurchaseOrderLines purchaseOrderLines={purchaseOrderLines} />;
}
