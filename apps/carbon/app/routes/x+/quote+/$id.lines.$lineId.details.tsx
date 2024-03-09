import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  QuotationLineForm,
  QuotationLineQuantities,
  getQuoteLine,
  getQuoteLineQuantities,
  quotationLineValidator,
  upsertQuoteLine,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
    role: "employee",
  });

  const { lineId } = params;
  if (!lineId) throw notFound("lineId not found");

  const [quotationLine, quotationLineQuantities] = await Promise.all([
    getQuoteLine(client, lineId),
    getQuoteLineQuantities(client, lineId),
  ]);

  return json({
    quotationLine: quotationLine?.data ?? null,
    quotationLineQuantities: quotationLineQuantities?.data ?? [],
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const { id: quoteId, lineId } = params;
  if (!quoteId) throw new Error("Could not find id");
  if (!lineId) throw new Error("Could not find lineId");

  const validation = await validator(quotationLineValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const updateQuotationLine = await upsertQuoteLine(client, {
    id: lineId,
    ...data,
    updatedBy: userId,
  });

  if (updateQuotationLine.error) {
    return redirect(
      path.to.quoteLine(quoteId, lineId),
      await flash(
        request,
        error(updateQuotationLine.error, "Failed to update quote line")
      )
    );
  }

  return redirect(path.to.quoteLine(quoteId, lineId));
}

export default function EditQuotationLineRoute() {
  const { quotationLine, quotationLineQuantities } =
    useLoaderData<typeof loader>();
  if (!quotationLine) throw new Error("Could not find quotation line");

  const initialValues = {
    id: quotationLine?.id ?? undefined,
    quoteId: quotationLine?.quoteId ?? "",
    partId: quotationLine?.partId ?? "",
    description: quotationLine?.description ?? "",
    customerPartId: quotationLine?.customerPartId ?? "",
    customerPartRevision: quotationLine?.customerPartRevision ?? "",
    replenishmentSystem: (quotationLine?.replenishmentSystem ?? "") as
      | "Buy"
      | "Make",
    status: quotationLine?.status ?? "Draft",
    unitOfMeasureCode: quotationLine?.unitOfMeasureCode ?? "",
  };

  return (
    <>
      <QuotationLineForm key={initialValues.id} initialValues={initialValues} />
      <QuotationLineQuantities
        quotationLine={quotationLine}
        quotationLineQuantities={quotationLineQuantities}
      />
    </>
  );
}
