import { Grid, VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { GroupedContentSidebar } from "~/components/Layout/Sidebar";
import {
  getAccountsList,
  getBaseCurrency,
  useAccountingSidebar,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export const meta: MetaFunction = () => {
  return [{ title: "Carbon | Accounting" }];
};
export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [baseCurrency, balanceSheetAccounts, incomeStatementAccounts] =
    await Promise.all([
      getBaseCurrency(client),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Balance Sheet",
      }),
      getAccountsList(client, {
        type: "Posting",
        incomeBalance: "Income Statement",
      }),
    ]);

  if (balanceSheetAccounts.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(
          balanceSheetAccounts.error,
          "Failed to fetch balance sheet accounts"
        )
      )
    );
  }

  if (incomeStatementAccounts.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(
          incomeStatementAccounts.error,
          "Failed to fetch income statement accounts"
        )
      )
    );
  }

  return json({
    baseCurrency: baseCurrency.data,
    balanceSheetAccounts: balanceSheetAccounts.data ?? [],
    incomeStatementAccounts: incomeStatementAccounts.data ?? [],
  });
}

export default function UsersRoute() {
  const { groups } = useAccountingSidebar();

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <GroupedContentSidebar groups={groups} />
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
