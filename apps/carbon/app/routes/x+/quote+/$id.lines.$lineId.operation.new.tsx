import { redirect, useParams } from "@remix-run/react";
import { useUrlParams } from "~/hooks";

import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  QuotationOperationForm,
  quotationOperationValidator,
  upsertQuoteOperation,
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

  const { id: quoteId, lineId: quoteLineId } = params;
  if (!quoteId) throw new Error("Could not find quoteId");
  if (!quoteLineId) throw new Error("Could not find quoteLineId");

  const validation = await validator(quotationOperationValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createQuotationOperation = await upsertQuoteOperation(client, {
    quoteId,
    quoteLineId,
    ...data,
    createdBy: userId,
  });

  if (createQuotationOperation.error) {
    return redirect(
      path.to.newQuoteOperation(quoteId, quoteLineId),
      await flash(
        request,
        error(
          createQuotationOperation.error,
          "Failed to create quote operation"
        )
      )
    );
  }

  const operationId = createQuotationOperation.data.id;
  if (operationId) {
    return redirect(path.to.quoteOperation(quoteId, quoteLineId, operationId));
  }
}

export default function NewQuoteOperation() {
  const { id: quoteId, lineId } = useParams();
  const [params] = useUrlParams();
  const quoteAssemblyId = params.get("parentOperationId");

  if (!quoteId) throw new Error("quoteId not found");
  if (!lineId) throw new Error("lineId not found");

  const initialValues = {
    quoteId,
    quoteLineId: lineId,
    quoteAssemblyId: quoteAssemblyId ?? undefined,
    description: "",
    workCellTypeId: "",
    productionStandard: 0,
    quotingRate: 0,
    laborRate: 0,
    overheadRate: 0,
    setupHours: 0,
    standardFactor: "Total Hours" as "Total Hours",
  };

  return <QuotationOperationForm initialValues={initialValues} />;
}
