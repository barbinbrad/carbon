import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, useParams } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import {
  QuotationAssemblyForm,
  quotationAssemblyValidator,
  upsertQuoteAssembly,
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

  const validation = await validator(quotationAssemblyValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createQuotationAssembly = await upsertQuoteAssembly(client, {
    quoteId,
    quoteLineId,
    ...data,
    createdBy: userId,
  });

  if (createQuotationAssembly.error) {
    return redirect(
      path.to.newQuoteAssembly(quoteId, quoteLineId),
      await flash(
        request,
        error(createQuotationAssembly.error, "Failed to create quote assembly")
      )
    );
  }

  const assemblyId = createQuotationAssembly.data.id;
  if (assemblyId) {
    return redirect(path.to.quoteAssembly(quoteId, quoteLineId, assemblyId));
  }
}

export default function NewQuoteAssembly() {
  const { id: quoteId, lineId } = useParams();
  const [params] = useUrlParams();
  const parentAssemblyId = params.get("parentAssemblyId");

  if (!quoteId) throw new Error("quoteId not found");
  if (!lineId) throw new Error("lineId not found");

  const initialValues = {
    quoteId,
    quoteLineId: lineId,
    parentAssemblyId: parentAssemblyId ?? undefined,
    partId: "",
    description: "",
    quantityPerParent: 1,
  };

  return <QuotationAssemblyForm initialValues={initialValues} />;
}
