import { Box } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useUrlParams } from "~/hooks";
import { getReceipt, getReceiptLines } from "~/modules/inventory";
import type { PurchaseInvoiceStatus } from "~/modules/invoicing";
import {
  PurchaseInvoiceForm,
  purchaseInvoiceValidator,
  upsertPurchaseInvoice,
} from "~/modules/invoicing";
import { getPurchaseOrder, getPurchaseOrderLines } from "~/modules/purchasing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    create: "invoicing",
  });

  const url = new URL(request.url);
  const sourceDocument = url.searchParams.get("sourceDocument") ?? undefined;
  const sourceDocumentId = url.searchParams.get("sourceDocumentId") ?? "";

  switch (sourceDocument) {
    case "Purchase Order":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");
      const [purchaseOrder, purchaseOrderLines] = await Promise.all([
        getPurchaseOrder(client, sourceDocumentId),
        // getUninvoicedPurchaseOrderLines(client, sourceDocumentId),
        getPurchaseOrderLines(client, sourceDocumentId),
      ]);

      if (purchaseOrder.error) {
        return redirect(
          request.headers.get("Referer") ?? path.to.purchaseOrders,
          await flash(
            request,
            error(purchaseOrder.error, "Failed to get purchase order")
          )
        );
      }

      if (purchaseOrderLines.error) {
        return redirect(
          request.headers.get("Referer") ?? path.to.purchaseOrders,
          await flash(
            request,
            error(
              purchaseOrderLines.error,
              "Failed to get purchase order lines"
            )
          )
        );
      }

    case "Receipt":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");

      const [receipt, receiptLines] = await Promise.all([
        getReceipt(client, sourceDocumentId),
        getReceiptLines(client, sourceDocumentId),
      ]);

      if (receipt.error) {
        return redirect(
          request.headers.get("Referer") ?? path.to.receipts,
          await flash(request, error(receipt.error, "Failed to get receipt"))
        );
      }

      if (receiptLines.error) {
        return redirect(
          request.headers.get("Referer") ?? path.to.receipts,
          await flash(
            request,
            error(receiptLines.error, "Failed to get receipt lines")
          )
        );
      }

    default:
      return null;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "invoicing",
  });

  const validation = await purchaseInvoiceValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const nextSequence = await getNextSequence(client, "purchaseInvoice", userId);
  if (nextSequence.error) {
    return redirect(
      path.to.newPurchaseInvoice,
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const { id, ...data } = validation.data;

  const createPurchaseInvoice = await upsertPurchaseInvoice(client, {
    ...data,
    invoiceId: nextSequence.data,
    createdBy: userId,
  });

  if (createPurchaseInvoice.error || !createPurchaseInvoice.data?.[0]) {
    // TODO: this should be done as a transaction
    await rollbackNextSequence(client, "purchaseInvoice", userId);
    return redirect(
      path.to.purchaseInvoices,
      await flash(
        request,
        error(createPurchaseInvoice.error, "Failed to insert purchase invoice")
      )
    );
  }

  const invoice = createPurchaseInvoice.data?.[0];

  return redirect(path.to.purchaseInvoice(invoice?.id!));
}

export default function PurchaseInvoiceNewRoute() {
  const [params] = useUrlParams();
  const supplierId = params.get("supplierId");
  const initialValues = {
    id: undefined,
    invoiceId: undefined,
    supplierId: supplierId ?? undefined,
    status: "Draft" as PurchaseInvoiceStatus,
  };

  return (
    <Box w="50%" maxW={720} minW={420}>
      <PurchaseInvoiceForm
        // @ts-expect-error
        initialValues={initialValues}
      />
    </Box>
  );
}
