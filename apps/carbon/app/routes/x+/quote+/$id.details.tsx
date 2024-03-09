import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { Quotation, QuotationAttachment } from "~/modules/sales";
import {
  QuotationDocuments,
  QuotationForm,
  quotationValidator,
  upsertQuote,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "sales",
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const validation = await validator(quotationValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { quoteId, ...data } = validation.data;
  if (!quoteId) throw new Error("Could not find quoteId");

  const updateQuotation = await upsertQuote(client, {
    id: id,
    quoteId,
    ...data,
    updatedBy: userId,
  });
  if (updateQuotation.error) {
    return redirect(
      path.to.quote(id),
      await flash(
        request,
        error(updateQuotation.error, "Failed to update quote")
      )
    );
  }

  return redirect(
    path.to.quote(id),
    await flash(request, success("Updated quote"))
  );
}

export default function QuotationBasicRoute() {
  const { id } = useParams();
  if (!id) throw new Error("Could not find id");
  const quoteData = useRouteData<{
    quotation: Quotation;
    internalDocuments: QuotationAttachment[];
  }>(path.to.quote(id));
  if (!quoteData) throw new Error("Could not find quote data");

  const initialValues = {
    id: quoteData?.quotation?.id ?? "",
    quoteId: quoteData?.quotation?.quoteId ?? "",
    name: quoteData?.quotation?.name ?? "",
    customerId: quoteData?.quotation?.customerId ?? "",
    ownerId: quoteData?.quotation.ownerId ?? "",
    customerContactId: quoteData?.quotation?.customerContactId ?? "",
    customerLocationId: quoteData?.quotation?.customerLocationId ?? "",
    customerReference: quoteData?.quotation?.customerReference ?? "",
    quoteDate: quoteData?.quotation?.quoteDate ?? "",
    expirationDate: quoteData?.quotation.expirationDate ?? undefined,
    status: quoteData?.quotation?.status ?? ("Draft" as "Draft"),
    notes: quoteData?.quotation?.notes ?? "",
  };

  return (
    <>
      <QuotationForm key={initialValues.id} initialValues={initialValues} />
      <QuotationDocuments
        id={id}
        attachments={quoteData.internalDocuments}
        isExternal={false}
      />
    </>
  );
}
