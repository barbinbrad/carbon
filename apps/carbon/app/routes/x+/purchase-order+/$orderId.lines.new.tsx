import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { PurchaseOrderLineType } from "~/modules/purchasing";
import {
  PurchaseOrderLineForm,
  purchaseOrderLineValidator,
  upsertPurchaseOrderLine,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const validation = await purchaseOrderLineValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createPurchaseOrderLine = await upsertPurchaseOrderLine(client, {
    ...data,
    createdBy: userId,
  });

  if (createPurchaseOrderLine.error) {
    return redirect(
      `/x/purchase-order/${orderId}/lines`,
      await flash(
        request,
        error(
          createPurchaseOrderLine.error,
          "Failed to create purchaseOrderLine."
        )
      )
    );
  }

  return redirect(`/x/purchase-order/${orderId}/lines`);
}

export default function NewPurchaseOrderLineRoute() {
  const { orderId } = useParams();
  const sharedPurchaseOrdersData = useRouteData<{
    purchaseOrderLineTypes: PurchaseOrderLineType[];
  }>("/x/purchase-order");

  if (!orderId) throw new Error("Could not find purchase order id");

  const initialValues = {
    purchaseOrderId: orderId,
    purchaseOrderLineType: "Part" as PurchaseOrderLineType,
    partId: "",
    purchaseQuantity: 1,
    unitPrice: 0,
    setupPrice: 0,
    unitOfMeasureCode: "",
    shelfId: "",
  };

  return (
    <PurchaseOrderLineForm
      initialValues={initialValues}
      purchaseOrderLineTypes={
        sharedPurchaseOrdersData?.purchaseOrderLineTypes ?? []
      }
    />
  );
}
