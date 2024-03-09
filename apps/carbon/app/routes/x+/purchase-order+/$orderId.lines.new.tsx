import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import type { PurchaseOrderLineType } from "~/modules/purchasing";
import {
  PurchaseOrderLineForm,
  purchaseOrderLineValidator,
  upsertPurchaseOrderLine,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const validation = await validator(purchaseOrderLineValidator).validate(
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
      path.to.purchaseOrderLines(orderId),
      await flash(
        request,
        error(
          createPurchaseOrderLine.error,
          "Failed to create purchase order line."
        )
      )
    );
  }

  return redirect(path.to.purchaseOrderLines(orderId));
}

export default function NewPurchaseOrderLineRoute() {
  const { orderId } = useParams();

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

  return <PurchaseOrderLineForm initialValues={initialValues} />;
}
