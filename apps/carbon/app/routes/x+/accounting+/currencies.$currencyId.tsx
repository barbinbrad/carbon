import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import {
  CurrencyForm,
  currencyValidator,
  getCurrency,
  upsertCurrency,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const { currencyId } = params;
  if (!currencyId) throw notFound("currencyId not found");

  const currency = await getCurrency(client, currencyId);

  return json({
    currency: currency?.data ?? null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "accounting",
  });

  const validation = await currencyValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("id not found");

  const updateCurrency = await upsertCurrency(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updateCurrency.error) {
    return json(
      {},
      await flash(
        request,
        error(updateCurrency.error, "Failed to update currency")
      )
    );
  }

  return redirect(
    "/x/accounting/currencies",
    await flash(request, success("Updated currency"))
  );
}

export default function EditCurrencysRoute() {
  const { currency } = useLoaderData<typeof loader>();

  const initialValues = {
    id: currency?.id ?? undefined,
    name: currency?.name ?? "",
    code: currency?.code ?? "",
    symbol: currency?.symbol ?? "",
    exchangeRate: currency?.exchangeRate ?? 1,
    isBaseCurrency: currency?.isBaseCurrency ?? false,
  };

  return <CurrencyForm initialValues={initialValues} />;
}
