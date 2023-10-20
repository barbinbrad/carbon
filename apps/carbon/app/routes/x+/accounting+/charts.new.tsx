import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type {
  AccountConsolidatedRate,
  AccountIncomeBalance,
  AccountNormalBalance,
  AccountType,
} from "~/modules/accounting";
import {
  accountValidator,
  ChartOfAccountForm,
  upsertAccount,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "accounting",
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "accounting",
  });

  const validation = await accountValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertAccount = await upsertAccount(client, {
    ...data,
    createdBy: userId,
  });
  if (insertAccount.error) {
    return json(
      {},
      await flash(
        request,
        error(insertAccount.error, "Failed to insert account")
      )
    );
  }

  const accountNumber = insertAccount.data?.id;
  if (!accountNumber) {
    return json(
      {},
      await flash(request, error(insertAccount, "Failed to insert account"))
    );
  }

  return redirect(
    path.to.chartOfAccounts,
    await flash(request, success("Account created"))
  );
}

export default function NewAccountRoute() {
  const initialValues = {
    name: "",
    number: "",
    type: "Posting" as AccountType,
    accountCategoryId: "",
    incomeBalance: "Balance Sheet" as AccountIncomeBalance,
    normalBalance: "Debit" as AccountNormalBalance,
    consolidatedRate: "Average" as AccountConsolidatedRate,
    directPosting: false,
  };

  return <ChartOfAccountForm initialValues={initialValues} />;
}
