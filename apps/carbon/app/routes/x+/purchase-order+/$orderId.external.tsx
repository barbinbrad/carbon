import { useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { PurchaseOrderAttachment } from "~/modules/purchasing";
import { PurchaseOrderDocuments } from "~/modules/purchasing";

export function action() {
  // used for reloading the data via fetcher.submit(null, { method: 'post'})
  return null;
}

export default function PurchaseOrderExternalDocumentsRoute() {
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const routeData = useRouteData<{
    externalDocuments: PurchaseOrderAttachment[];
  }>(`/x/purchase-order/${orderId}`);

  return (
    <PurchaseOrderDocuments
      documents={routeData?.externalDocuments ?? []}
      isExternal
      orderId={orderId}
    />
  );
}
