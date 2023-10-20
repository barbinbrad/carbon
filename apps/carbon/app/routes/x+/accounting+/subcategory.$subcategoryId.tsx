import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  accountSubcategoryValidator,
  upsertAccountSubcategory,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "accounting",
  });

  const { subcategoryId } = params;
  if (!subcategoryId) throw new Error("subcategoryId not found");

  const validation = await accountSubcategoryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const update = await upsertAccountSubcategory(client, {
    id: subcategoryId,
    ...data,
    updatedBy: userId,
  });
  if (update.error)
    redirect(
      path.to.accountingCategories,
      await flash(
        request,
        error(update.error, "Failed to update G/L subcategory")
      )
    );

  return redirect(
    path.to.accountingCategories,
    await flash(request, success("Successfully updated G/L subcategory"))
  );
}
