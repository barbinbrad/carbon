import { Box } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { FunctionsResponse } from "@supabase/functions-js";
import { validationError } from "remix-validated-form";
import { useUrlParams } from "~/hooks";
import type { PurchaseInvoiceStatus } from "~/modules/invoicing";
import {
  PurchaseInvoiceForm,
  createPurchaseInvoiceFromPurchaseOrder,
  createPurchaseInvoiceFromReceipt,
  purchaseInvoiceValidator,
  upsertPurchaseInvoice,
} from "~/modules/invoicing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  // we don't use the client here -- if they have this permission, we'll upgrade to a service role if needed
  await requirePermissions(request, {
    create: "invoicing",
  });

  const url = new URL(request.url);
  const sourceDocument = url.searchParams.get("sourceDocument") ?? undefined;
  const sourceDocumentId = url.searchParams.get("sourceDocumentId") ?? "";

  let result: FunctionsResponse<{ id: string }>;

  switch (sourceDocument) {
    case "Purchase Order":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");
      result = await createPurchaseInvoiceFromPurchaseOrder(sourceDocumentId);

      if (result.error || !result?.data) {
        return redirect(
          request.headers.get("Referer") ?? path.to.purchaseOrders,
          await flash(
            request,
            error(result.error, "Failed to create purchase invoice")
          )
        );
      }

      return redirect(path.to.purchaseInvoice(result.data?.id!));

    case "Receipt":
      if (!sourceDocumentId) throw new Error("Missing sourceDocumentId");

      result = await createPurchaseInvoiceFromReceipt(sourceDocumentId);

      if (result.error || !result?.data) {
        return redirect(
          request.headers.get("Referer") ?? path.to.receipts,
          await flash(
            request,
            error(result.error, "Failed to create purchase invoice")
          )
        );
      }

      return redirect(path.to.purchaseInvoice(result.data?.id!));

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
