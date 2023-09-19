import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteAccountSubcategory } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "accounting",
  });

  const { subcategoryId } = params;
  if (!subcategoryId) {
    return redirect(
      "/x/accounting/categories",
      await flash(
        request,
        error(params, "Failed to get a G/L account subcategory id")
      )
    );
  }

  const deactivateSubcategory = await deleteAccountSubcategory(
    client,
    subcategoryId
  );
  if (deactivateSubcategory.error) {
    return redirect(
      "/x/accounting/categories",
      await flash(
        request,
        error(
          deactivateSubcategory.error,
          "Failed to deactivate G/L account subcategory"
        )
      )
    );
  }

  return redirect(
    "/x/accounting/categories",
    await flash(
      request,
      success("Successfully deactivated G/L account subcategory")
    )
  );
}
