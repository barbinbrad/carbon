import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import type { PaymentTermCalculationMethod } from "~/modules/accounting";
import {
  PaymentTermForm,
  paymentTermValidator,
  getPaymentTerm,
  upsertPaymentTerm,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const { paymentTermId } = params;
  if (!paymentTermId) throw notFound("paymentTermId not found");

  const paymentTerm = await getPaymentTerm(client, paymentTermId);

  return json({
    paymentTerm: paymentTerm?.data ?? null,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "accounting",
  });

  const validation = await paymentTermValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("id not found");

  const updatePaymentTerm = await upsertPaymentTerm(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updatePaymentTerm.error) {
    return json(
      {},
      await flash(
        request,
        error(updatePaymentTerm.error, "Failed to update payment term")
      )
    );
  }

  return redirect(
    "/x/accounting/payment-terms",
    await flash(request, success("Updated payment term"))
  );
}

export default function EditPaymentTermsRoute() {
  const { paymentTerm } = useLoaderData<typeof loader>();

  const initialValues = {
    id: paymentTerm?.id ?? undefined,
    name: paymentTerm?.name ?? "",
    daysDue: paymentTerm?.daysDue ?? 0,
    daysDiscount: paymentTerm?.daysDiscount ?? 0,
    discountPercentage: paymentTerm?.discountPercentage ?? 0,
    calculationMethod:
      paymentTerm?.calculationMethod ?? ("Net" as PaymentTermCalculationMethod),
  };

  return <PaymentTermForm initialValues={initialValues} />;
}
