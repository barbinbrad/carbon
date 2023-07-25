import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import {
  ChartOfAccountForm,
  accountValidator,
  getAccount,
  upsertAccount,
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

  const { accountId } = params;
  if (!accountId) throw notFound("accountId not found");

  const account = await getAccount(client, accountId);

  return json({
    account: account?.data ?? null,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "accounting",
  });

  const validation = await accountValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("id not found");

  const updateAccount = await upsertAccount(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updateAccount.error) {
    return json(
      {},
      await flash(
        request,
        error(updateAccount.error, "Failed to update account")
      )
    );
  }

  return redirect(
    "/x/accounting/charts",
    await flash(request, success("Updated account"))
  );
}

export default function EditChartOfAccountsRoute() {
  const { account } = useLoaderData<typeof loader>();

  const initialValues = {
    id: account?.id ?? undefined,
    number: account?.number ?? "",
    name: account?.name ?? "",
    type: account?.type ?? "Posting",
    accountCategoryId: account?.accountCategoryId ?? undefined,
    accountSubcategoryId: account?.accountSubcategoryId ?? undefined,
    normalBalance: account?.normalBalance ?? "Debit",
    incomeBalance: account?.incomeBalance ?? "Balance Sheet",
    consolidatedRate: account?.consolidatedRate ?? "Average",
    directPosting: account?.directPosting ?? false,
  };

  return <ChartOfAccountForm initialValues={initialValues} />;
}
