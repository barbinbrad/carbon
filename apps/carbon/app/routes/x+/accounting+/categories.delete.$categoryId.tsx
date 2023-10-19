import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteAccountCategory } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "accounting",
  });

  const { categoryId } = params;
  if (!categoryId) {
    return redirect(
      path.accountingCategories,
      await flash(request, error(params, "Failed to get a category id"))
    );
  }

  const deactivateAttribute = await deleteAccountCategory(client, categoryId);
  if (deactivateAttribute.error) {
    return redirect(
      path.accountingCategories,
      await flash(
        request,
        error(
          deactivateAttribute.error,
          "Failed to deactivate G/L account category"
        )
      )
    );
  }

  return redirect(
    path.accountingCategories,
    await flash(
      request,
      success("Successfully deactivated G/L account category")
    )
  );
}
