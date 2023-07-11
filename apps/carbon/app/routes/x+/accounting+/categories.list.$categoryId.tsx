import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import {
  AccountCategoryDetail,
  getAccountCategory,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const { categoryId } = params;
  if (!categoryId) throw notFound("Invalid categoryId");

  const accountCategory = await getAccountCategory(client, categoryId);
  if (accountCategory.error) {
    return redirect(
      "/x/accounting/categories",
      await flash(
        request,
        error(accountCategory.error, "Failed to fetch account category")
      )
    );
  }

  return json({ accountCategory: accountCategory.data });
}

export default function AccountCategoryListRoute() {
  const { accountCategory } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () =>
    navigate(`/x/accounting/categories?${params.toString()}`);

  return (
    <>
      <AccountCategoryDetail
        accountCategory={accountCategory}
        onClose={onClose}
      />
      <Outlet />
    </>
  );
}
