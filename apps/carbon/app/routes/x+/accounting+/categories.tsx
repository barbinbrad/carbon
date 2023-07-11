import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requirePermissions } from "~/services/auth";
import {
  AccountCategoriesTable,
  AccountCategoriesTableFilters,
  getAccountCategories,
  getIncomeBalanceEnum,
  getNormalBalanceEnum,
} from "~/modules/accounting";
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
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [categories, incomeBalances, normalBalances] = await Promise.all([
    getAccountCategories(client, { name, limit, offset, sorts }),
    getIncomeBalanceEnum(),
    getNormalBalanceEnum(),
  ]);

  if (categories.error) {
    redirect(
      "/x",
      await flash(
        request,
        error(categories.error, "Failed to fetch account categories")
      )
    );
  }

  return json({
    count: categories.count ?? 0,
    categories: categories.data ?? [],
    incomeBalances,
    normalBalances,
  });
}

export default function GlAccountCategoriesRoute() {
  const { count, categories } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <AccountCategoriesTableFilters />
      <AccountCategoriesTable data={categories} count={count} />
      <Outlet />
    </VStack>
  );
}
