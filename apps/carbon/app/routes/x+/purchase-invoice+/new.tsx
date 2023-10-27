import { Box } from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useUrlParams } from "~/hooks";
import type { PurchaseInvoiceStatus } from "~/modules/invoicing";
import {
  PurchaseInvoiceForm,
  purchaseInvoiceValidator,
  upsertPurchaseInvoice,
} from "~/modules/invoicing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

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
