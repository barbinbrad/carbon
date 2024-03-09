import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import type { PurchaseInvoiceLineType } from "~/modules/invoicing";
import {
  PurchaseInvoiceLineForm,
  purchaseInvoiceLineValidator,
  upsertPurchaseInvoiceLine,
} from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "invoicing",
  });

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const validation = await validator(purchaseInvoiceLineValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createPurchaseInvoiceLine = await upsertPurchaseInvoiceLine(client, {
    ...data,
    createdBy: userId,
  });

  if (createPurchaseInvoiceLine.error) {
    return redirect(
      path.to.purchaseInvoiceLines(invoiceId),
      await flash(
        request,
        error(
          createPurchaseInvoiceLine.error,
          "Failed to create purchase invoice line."
        )
      )
    );
  }

  return redirect(path.to.purchaseInvoiceLines(invoiceId));
}

export default function NewPurchaseInvoiceLineRoute() {
  const { invoiceId } = useParams();

  if (!invoiceId) throw new Error("Could not find purchase invoice id");

  const initialValues = {
    invoiceId: invoiceId,
    invoiceLineType: "Part" as PurchaseInvoiceLineType,
    partId: "",
    quantity: 1,
    unitPrice: 0,
    setupPrice: 0,
    unitOfMeasureCode: "",
    shelfId: "",
  };

  return <PurchaseInvoiceLineForm initialValues={initialValues} />;
}
