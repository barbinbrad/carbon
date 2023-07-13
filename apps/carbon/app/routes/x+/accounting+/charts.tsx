import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ChartOfAccountsTable,
  ChartOfAccountsTableFilters,
  getChartOfAccounts,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { sorts } = getGenericQueryFilters(searchParams);

  const chartOfAccounts = await getChartOfAccounts(client, {
    name,
    sorts,
  });

  if (chartOfAccounts.error) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(chartOfAccounts.error, "Failed to get chart of accounts")
      )
    );
  }

  return json({
    chartOfAccounts: chartOfAccounts.data ?? [],
  });
}

export default function ChartOfAccountsRoute() {
  const { chartOfAccounts } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ChartOfAccountsTableFilters />
      <ChartOfAccountsTable data={chartOfAccounts} />
      <Outlet />
    </VStack>
  );
}
