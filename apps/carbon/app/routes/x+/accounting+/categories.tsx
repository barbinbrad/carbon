import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  AccountCategoriesTable,
  AccountCategoriesTableFilters,
  getAccountCategories,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Categories",
  to: path.to.accountingCategories,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const incomeBalance = searchParams.get("incomeBalance");
  const accountClass = searchParams.get("class");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [categories] = await Promise.all([
    getAccountCategories(client, {
      name,
      class: accountClass,
      incomeBalance,
      limit,
      offset,
      sorts,
    }),
  ]);

  if (categories.error) {
    redirect(
      path.to.authenticatedRoot,
      await flash(
        request,
        error(categories.error, "Failed to fetch account categories")
      )
    );
  }

  return json({
    count: categories.count ?? 0,
    categories: categories.data ?? [],
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
