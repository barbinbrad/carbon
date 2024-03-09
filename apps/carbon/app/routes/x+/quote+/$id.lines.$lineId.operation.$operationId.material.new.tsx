import { json, redirect } from "@remix-run/react";

import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  QuotationMaterialForm,
  quotationMaterialValidator,
  upsertQuoteMaterial,
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

  const {
    id: quoteId,
    lineId: quoteLineId,
    operationId: quoteOperationId,
  } = params;
  if (!quoteId) throw new Error("Could not find quoteId");
  if (!quoteLineId) throw new Error("Could not find quoteLineId");
  if (!quoteOperationId) throw new Error("Could not find operationId");

  const validation = await validator(quotationMaterialValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createQuotationMaterial = await upsertQuoteMaterial(client, {
    quoteId,
    quoteLineId,
    quoteOperationId,
    ...data,
    createdBy: userId,
  });

  if (createQuotationMaterial.error) {
    return json(
      path.to.quote(quoteId),
      await flash(
        request,
        error(createQuotationMaterial.error, "Failed to create quote material")
      )
    );
  }

  return redirect(
    path.to.quoteOperation(quoteId, quoteLineId, quoteOperationId)
  );
}

export default function NewQuoteMaterial() {
  const initialValues = {
    partId: "",
    quantity: 1,
    description: "",
    unitCost: 0,
    unitOfMeasureCode: "EA",
  };

  return <QuotationMaterialForm initialValues={initialValues} />;
}
