import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  CurrencyForm,
  currencyValidator,
  upsertCurrency,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    create: "accounting",
  });

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "accounting",
  });

  const validation = await currencyValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertCurrency = await upsertCurrency(client, {
    ...data,
    createdBy: userId,
  });
  if (insertCurrency.error) {
    return json(
      {},
      await flash(
        request,
        error(insertCurrency.error, "Failed to insert currency")
      )
    );
  }

  const currencyId = insertCurrency.data[0]?.id;
  if (!currencyId) {
    return json(
      {},
      await flash(request, error(insertCurrency, "Failed to insert currency"))
    );
  }

  return redirect(
    "/x/accounting/currencies",
    await flash(request, success("Currency created"))
  );
}

export default function NewCurrencysRoute() {
  const initialValues = {
    name: "",
    code: "",
    symbol: "",
    exchangeRate: 1,
    isBaseCurrency: false,
  };

  return <CurrencyForm initialValues={initialValues} />;
}
