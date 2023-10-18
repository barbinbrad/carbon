import { Flex } from "@chakra-ui/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { PurchaseInvoice } from "~/modules/invoicing";
import {
  PurchaseInvoiceForm,
  // PurchaseInvoiceLines,
  purchaseInvoiceValidator,
  upsertPurchaseInvoice,
} from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "invoicing",
  });

  const { invoiceId: id } = params;
  if (!id) throw new Error("Could not find invoiceId");

  // validate with invoicingValidator
  const validation = await purchaseInvoiceValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { invoiceId, ...data } = validation.data;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const updatePurchaseInvoice = await upsertPurchaseInvoice(client, {
    id,
    invoiceId,
    ...data,
    updatedBy: userId,
  });
  if (updatePurchaseInvoice.error) {
    return redirect(
      `/x/purchase-invoice/${invoiceId}`,
      await flash(
        request,
        error(updatePurchaseInvoice.error, "Failed to update purchase invoice")
      )
    );
  }

  return redirect(
    `/x/purchase-invoice/${invoiceId}`,
    await flash(request, success("Updated purchase invoice"))
  );
}

export default function PurchaseInvoiceBasicRoute() {
  const { invoiceId } = useParams();
  const invoiceData = useRouteData<{ purchaseInvoice: PurchaseInvoice }>(
    `/x/purchase-invoice/${invoiceId}`
  );
  if (!invoiceData) throw new Error("Could not find invoice data");

  const initialValues = {
    id: invoiceData?.purchaseInvoice?.id ?? "",
    invoiceId: invoiceData?.purchaseInvoice?.invoiceId ?? "",
    supplierId: invoiceData?.purchaseInvoice?.supplierId ?? "",
    supplierContactId: invoiceData?.purchaseInvoice?.supplierContactId ?? "",
    supplierReference: invoiceData?.purchaseInvoice?.supplierReference ?? "",
    dateDue: invoiceData?.purchaseInvoice?.dateDue ?? "",
    status: invoiceData?.purchaseInvoice?.status ?? ("Draft" as "Draft"),
  };

  return (
    <>
      <Flex w="full" rowGap={4} flexDirection="column">
        <PurchaseInvoiceForm initialValues={initialValues} />
        {/* <PurchaseInvoiceLines /> */}
        <Outlet />
      </Flex>
    </>
  );
}
