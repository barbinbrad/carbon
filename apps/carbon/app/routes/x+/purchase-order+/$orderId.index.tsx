import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type {
  PurchaseOrder,
  PurchaseOrderApprovalStatus,
  PurchaseOrderType,
} from "~/modules/purchasing";
import {
  PurchaseOrderForm,
  purchaseOrderValidator,
  upsertPurchaseOrder,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  // validate with purchasingValidator
  const validation = await purchaseOrderValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { purchaseOrderId, ...data } = validation.data;
  if (!purchaseOrderId) throw new Error("Could not find purchaseOrderId");

  const updatePurchaseOrder = await upsertPurchaseOrder(client, {
    id: orderId,
    purchaseOrderId,
    ...data,
    updatedBy: userId,
  });
  if (updatePurchaseOrder.error) {
    return redirect(
      `/x/purchase-order/${orderId}`,
      await flash(
        request,
        error(updatePurchaseOrder.error, "Failed to update purchase order")
      )
    );
  }

  return redirect(
    `/x/purchase-order/${orderId}`,
    await flash(request, success("Updated purchase order"))
  );
}

export default function PurchaseOrderBasicRoute() {
  const sharedPurchaseOrdersData = useRouteData<{
    purchaseOrderApprovalStatuses: PurchaseOrderApprovalStatus[];
    purchaseOrderTypes: PurchaseOrderType[];
  }>("/x/purchase-order");

  const { orderId } = useParams();
  const orderData = useRouteData<PurchaseOrder>(`/x/purchase-order/${orderId}`);
  if (!orderData) throw new Error("Could not find part data");

  const initialValues = {
    id: orderData.id ?? "",
    purchaseOrderId: orderData.purchaseOrderId ?? "",
    supplierId: orderData.supplierId ?? "",
    supplierContactId: orderData.supplierContactId ?? "",
    supplierReference: orderData.supplierReference ?? "",
    orderDate: orderData.orderDate ?? "",
    type: orderData.type ?? "Draft",
    status: orderData.status ?? "Draft",
    receiptRequestedDate: orderData.receiptRequestedDate ?? "",
    receiptPromisedDate: orderData.receiptPromisedDate ?? "",
    notes: orderData.notes ?? "",
    closed: orderData.closed ?? false,
  };

  return (
    <PurchaseOrderForm
      initialValues={initialValues}
      purchaseOrderApprovalStatuses={
        sharedPurchaseOrdersData?.purchaseOrderApprovalStatuses ?? []
      }
      purchaseOrderTypes={sharedPurchaseOrdersData?.purchaseOrderTypes ?? []}
    />
  );
}
