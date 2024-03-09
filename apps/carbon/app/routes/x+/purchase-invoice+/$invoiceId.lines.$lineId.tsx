import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { PurchaseInvoiceLineType } from "~/modules/invoicing";
import {
  PurchaseInvoiceLineForm,
  getPurchaseInvoiceLine,
  purchaseInvoiceLineValidator,
  upsertPurchaseInvoiceLine,
} from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const { lineId } = params;
  if (!lineId) throw notFound("lineId not found");

  const purchaseInvoiceLine = await getPurchaseInvoiceLine(client, lineId);

  return json({
    purchaseInvoiceLine: purchaseInvoiceLine?.data ?? null,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "invoicing",
  });

  const { invoiceId, lineId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");
  if (!lineId) throw new Error("Could not find lineId");

  const validation = await validator(purchaseInvoiceLineValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  if (data.invoiceLineType === "Part") {
    data.accountNumber = undefined;
    data.assetId = undefined;
    data.serviceId = undefined;
  } else if (data.invoiceLineType === "Service") {
    data.accountNumber = undefined;
    data.assetId = undefined;
    data.partId = undefined;
  } else if (data.invoiceLineType === "G/L Account") {
    data.assetId = undefined;
    data.partId = undefined;
    data.serviceId = undefined;
  } else if (data.invoiceLineType === "Fixed Asset") {
    data.accountNumber = undefined;
    data.partId = undefined;
    data.serviceId = undefined;
  } else if (data.invoiceLineType === "Comment") {
    data.accountNumber = undefined;
    data.assetId = undefined;
    data.partId = undefined;
    data.serviceId = undefined;
  }

  const updatePurchaseInvoiceLine = await upsertPurchaseInvoiceLine(client, {
    id: lineId,
    ...data,
    updatedBy: userId,
  });

  if (updatePurchaseInvoiceLine.error) {
    return redirect(
      path.to.purchaseInvoiceLines(invoiceId),
      await flash(
        request,
        error(
          updatePurchaseInvoiceLine.error,
          "Failed to update purchase invoice line"
        )
      )
    );
  }

  return redirect(path.to.purchaseInvoiceLines(invoiceId));
}

export default function EditPurchaseInvoiceLineRoute() {
  const { purchaseInvoiceLine } = useLoaderData<typeof loader>();

  const initialValues = {
    id: purchaseInvoiceLine?.id ?? undefined,
    invoiceId: purchaseInvoiceLine?.invoiceId ?? "",
    invoiceLineType:
      purchaseInvoiceLine?.invoiceLineType ??
      ("Part" as PurchaseInvoiceLineType),
    partId: purchaseInvoiceLine?.partId ?? "",
    serviceId: purchaseInvoiceLine?.serviceId ?? "",
    accountNumber: purchaseInvoiceLine?.accountNumber ?? "",
    assetId: purchaseInvoiceLine?.assetId ?? "",
    description: purchaseInvoiceLine?.description ?? "",
    quantity: purchaseInvoiceLine?.quantity ?? 1,
    unitPrice: purchaseInvoiceLine?.unitPrice ?? 0,
    currencyCode: purchaseInvoiceLine?.currencyCode ?? "USD",
    unitOfMeasureCode: purchaseInvoiceLine?.unitOfMeasureCode ?? "",
    shelfId: purchaseInvoiceLine?.shelfId ?? "",
  };

  return (
    <PurchaseInvoiceLineForm
      key={initialValues.id}
      initialValues={initialValues}
    />
  );
}
