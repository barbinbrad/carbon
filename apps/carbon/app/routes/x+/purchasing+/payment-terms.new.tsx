import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { PaymentTermCalculationMethod } from "~/modules/purchasing";
import {
  PaymentTermForm,
  paymentTermValidator,
  upsertPaymentTerm,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    create: "purchasing",
  });

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await paymentTermValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    name,
    description,
    daysDue,
    daysDiscount,
    discountPercentage,
    gracePeriod,
    calculationMethod,
  } = validation.data;

  const insertPaymentTerm = await upsertPaymentTerm(client, {
    name,
    description,
    daysDue,
    daysDiscount,
    discountPercentage,
    gracePeriod,
    calculationMethod,
    createdBy: userId,
  });
  if (insertPaymentTerm.error) {
    return json(
      {},
      await flash(
        request,
        error(insertPaymentTerm.error, "Failed to insert payment term")
      )
    );
  }

  const paymentTermId = insertPaymentTerm.data[0]?.id;
  if (!paymentTermId) {
    return json(
      {},
      await flash(
        request,
        error(insertPaymentTerm, "Failed to insert payment term")
      )
    );
  }

  return redirect(
    "/x/purchasing/payment-terms",
    await flash(request, success("Payment term created"))
  );
}

export default function NewPaymentTermsRoute() {
  const initialValues = {
    name: "",
    daysDue: 0,
    daysDiscount: 0,
    discountPercentage: 0,
    gracePeriod: 0,
    calculationMethod: "Transaction Date" as PaymentTermCalculationMethod,
  };

  return <PaymentTermForm initialValues={initialValues} />;
}
