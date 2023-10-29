import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAccountSubcategoriesByCategory } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {
    view: "accounting",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const accountCategoryId = searchParams.get("accountCategoryId") as string;

  if (!accountCategoryId || accountCategoryId === "undefined")
    return json({
      data: [],
    });

  const subcategories = await getAccountSubcategoriesByCategory(
    authorized.client,
    accountCategoryId
  );
  if (subcategories.error) {
    return json(
      subcategories,
      await flash(
        request,
        error(subcategories.error, "Failed to get account subcategories")
      )
    );
  }

  return json(subcategories);
}
