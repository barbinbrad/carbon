import { useColor } from "@carbon/react";
import { VStack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import { useRouteData } from "~/hooks";
import type { AccountListItem } from "~/modules/accounting";
import {
  AccountDefaultsForm,
  defaultAcountValidator,
  getDefaultAccounts,
  updateDefaultAccounts,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Defaults",
  to: path.to.accountingDefaults,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [defaultAccounts] = await Promise.all([getDefaultAccounts(client)]);

  if (defaultAccounts.error || !defaultAccounts.data) {
    return redirect(
      path.to.accounting,
      await flash(
        request,
        error(defaultAccounts.error, "Failed to load default accounts")
      )
    );
  }

  return json({
    defaultAccounts: defaultAccounts.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
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
    path.to.accountingDefaults,
    await flash(request, success("Updated default accounts"))
  );
}

export default function AccountDefaultsRoute() {
  const { defaultAccounts } = useLoaderData<typeof loader>();
  const routeData = useRouteData<{
    balanceSheetAccounts: AccountListItem[];
    incomeStatementAccounts: AccountListItem[];
  }>(path.to.accounting);

  return (
    <VStack bg={useColor("white")} w="full" h="full" p={8} overflowY="auto">
      <PageTitle
        title="Account Defaults"
        subtitle="These accounts will be used to prepopulate posting grous when a new customer type, supplier type, part group, or location is created."
      />

      <AccountDefaultsForm
        balanceSheetAccounts={routeData?.balanceSheetAccounts ?? []}
        incomeStatementAccounts={routeData?.incomeStatementAccounts ?? []}
        initialValues={defaultAccounts}
      />
    </VStack>
  );
}
