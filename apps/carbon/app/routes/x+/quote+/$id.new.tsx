import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  QuotationLineForm,
  insertQuoteLineQuantity,
  quotationLineValidator,
  upsertQuoteLine,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const { id: quoteId } = params;
  if (!quoteId) throw new Error("Could not find id");

  const validation = await validator(quotationLineValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createQuotationLine = await upsertQuoteLine(client, {
    ...data,
    createdBy: userId,
  });

  if (createQuotationLine.error) {
    return redirect(
      path.to.quote(quoteId),
      await flash(
        request,
        error(createQuotationLine.error, "Failed to create quote line.")
      )
    );
  }

  const quoteLineId = createQuotationLine.data.id;

  const createQuoteQuantity = await insertQuoteLineQuantity(client, {
    quoteId,
    quoteLineId,
    quantity: 1,
    createdBy: userId,
  });

  if (createQuoteQuantity.error) {
    return redirect(
      path.to.quoteLine(quoteId, quoteLineId),
      await flash(
        request,
        error(
          createQuoteQuantity.error,
          "Failed to create quote line quantity."
        )
      )
    );
  }

  return redirect(path.to.quoteLine(quoteId, quoteLineId));
}

export default function NewQuotationLineRoute() {
  const { id } = useParams();

  if (!id) throw new Error("Could not find quote id");

  const initialValues = {
    quoteId: id,
    partId: "",
    description: "",
    replenishmentSystem: "" as "Buy" | "Make",
    unitOfMeasureCode: "",
    status: "Draft" as "Draft",
  };

  return <QuotationLineForm initialValues={initialValues} />;
}
