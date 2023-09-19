import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import type { PurchaseOrderLineType } from "~/modules/purchasing";
import {
  getPurchaseOrderLine,
  PurchaseOrderLineForm,
  purchaseOrderLineValidator,
  upsertPurchaseOrderLine,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const { lineId } = params;
  if (!lineId) throw notFound("lineId not found");

  const purchaseOrderLine = await getPurchaseOrderLine(client, lineId);

  return json({
    purchaseOrderLine: purchaseOrderLine?.data ?? null,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { orderId, lineId } = params;
  if (!orderId) throw new Error("Could not find orderId");
  if (!lineId) throw new Error("Could not find lineId");

  const validation = await purchaseOrderLineValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  if (data.purchaseOrderLineType === "Part") {
    data.accountNumber = undefined;
    data.assetId = undefined;
  } else if (data.purchaseOrderLineType === "G/L Account") {
    data.assetId = undefined;
    data.partId = undefined;
  } else if (data.purchaseOrderLineType === "Fixed Asset") {
    data.accountNumber = undefined;
    data.partId = undefined;
  } else if (data.purchaseOrderLineType === "Comment") {
    data.accountNumber = undefined;
    data.assetId = undefined;
    data.partId = undefined;
  }

  const updatePurchaseOrderLine = await upsertPurchaseOrderLine(client, {
    id: lineId,
    ...data,
    updatedBy: userId,
  });

  if (updatePurchaseOrderLine.error) {
    return redirect(
      `/x/purchase-order/${orderId}/lines`,
      await flash(
        request,
        error(
          updatePurchaseOrderLine.error,
          "Failed to update purchaseOrderLine."
        )
      )
    );
  }

  return redirect(`/x/purchase-order/${orderId}/lines`);
}

export default function EditPurchaseOrderLineRoute() {
  const { purchaseOrderLine } = useLoaderData<typeof loader>();

  const initialValues = {
    id: purchaseOrderLine?.id ?? undefined,
    purchaseOrderId: purchaseOrderLine?.purchaseOrderId ?? "",
    purchaseOrderLineType:
      purchaseOrderLine?.purchaseOrderLineType ??
      ("Part" as PurchaseOrderLineType),
    partId: purchaseOrderLine?.partId ?? "",
    description: purchaseOrderLine?.description ?? "",
    purchaseQuantity: purchaseOrderLine?.purchaseQuantity ?? 1,
    unitPrice: purchaseOrderLine?.unitPrice ?? 0,
    setupPrice: purchaseOrderLine?.setupPrice ?? 0,
    unitOfMeasureCode: purchaseOrderLine?.unitOfMeasureCode ?? "",
    shelfId: purchaseOrderLine?.shelfId ?? "",
  };

  return <PurchaseOrderLineForm initialValues={initialValues} />;
}
