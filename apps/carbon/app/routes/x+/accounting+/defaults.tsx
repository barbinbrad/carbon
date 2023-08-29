import { useColor } from "@carbon/react";
import { VStack } from "@chakra-ui/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import {
  AccountDefaultsForm,
  defaultAcountValidator,
  getAccountsList,
  getDefaultAccounts,
  updateDefaultAccounts,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [defaultAccounts, balanceSheetAccounts, incomeStatementAccounts] =
    await Promise.all([
      getDefaultAccounts(client),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Balance Sheet",
      }),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Income Statement",
      }),
    ]);

  if (defaultAccounts.error || !defaultAccounts.data) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(defaultAccounts.error, "Failed to load default accounts")
      )
    );
  }

  if (balanceSheetAccounts.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(
          balanceSheetAccounts.error,
          "Failed to load balance sheet accounts"
        )
      )
    );
  }

  if (incomeStatementAccounts.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(
          incomeStatementAccounts.error,
          "Failed to load income statement accounts"
        )
      )
    );
  }

  return json({
    balanceSheetAccounts: balanceSheetAccounts.data ?? [],
    defaultAccounts: defaultAccounts.data,
    incomeStatementAccounts: incomeStatementAccounts.data ?? [],
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "accounting",
  });

  const validation = await defaultAcountValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updateDefaults = await updateDefaultAccounts(client, {
    ...validation.data,
    updatedBy: userId,
  });
  if (updateDefaults.error) {
    return json(
      {},
      await flash(
        request,
        error(updateDefaults.error, "Failed to update default accounts")
      )
    );
  }

  return redirect(
    "/x/accounting/defaults",
    await flash(request, success("Updated default accounts"))
  );
}

export default function AccountDefaultsRoute() {
  const { balanceSheetAccounts, incomeStatementAccounts, defaultAccounts } =
    useLoaderData<typeof loader>();

  return (
    <VStack bg={useColor("white")} w="full" h="full" p={8} overflowY="auto">
      <PageTitle
        title="Account Defaults"
        subtitle="These accounts will be used to prepopulate posting grous when a new customer type, supplier type, part group, or location is created."
      />

      <AccountDefaultsForm
        balanceSheetAccounts={balanceSheetAccounts}
        incomeStatementAccounts={incomeStatementAccounts}
        initialValues={defaultAccounts}
      />
    </VStack>
  );
}
