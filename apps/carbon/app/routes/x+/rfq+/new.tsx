import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  RequestForQuoteForm,
  requestForQuoteValidator,
  upsertRequestForQuote,
} from "~/modules/purchasing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await validator(requestForQuoteValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const nextSequence = await getNextSequence(client, "requestForQuote", userId);
  if (nextSequence.error) {
    return redirect(
      path.to.newRequestForQuote,
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const createRequestForQuote = await upsertRequestForQuote(client, {
    ...validation.data,
    requestForQuoteId: nextSequence.data,
    createdBy: userId,
  });

  if (createRequestForQuote.error || !createRequestForQuote.data?.[0]) {
    // TODO: this should be done as a transaction
    await rollbackNextSequence(client, "requestForQuote", userId);
    return redirect(
      path.to.requestForQuotes,
      await flash(
        request,
        error(createRequestForQuote.error, "Failed to insert request for quote")
      )
    );
  }

  const order = createRequestForQuote.data?.[0];

  return redirect(path.to.requestForQuote(order.id!));
}

export default function RequestForQuoteNewRoute() {
  const today = new Date().toISOString().split("T")[0];
  const initialValues = {
    name: "",
    receiptDate: today,
    status: "Draft" as "Draft",
  };

  return (
    <div className="w-1/2 max-w-[720px] min-w-[420px] mx-auto">
      <RequestForQuoteForm initialValues={initialValues} />
    </div>
  );
}
