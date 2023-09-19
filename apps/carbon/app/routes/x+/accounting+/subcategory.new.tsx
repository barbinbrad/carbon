import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  accountSubcategoryValidator,
  upsertAccountSubcategory,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "accounting",
  });

  const validation = await accountSubcategoryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createSubcategory = await upsertAccountSubcategory(client, {
    ...data,
    createdBy: userId,
  });
  if (createSubcategory.error) {
    return json(
      {},
      await flash(
        request,
        error(
          createSubcategory.error,
          "Failed to create G/L account subcategory"
        )
      )
    );
  }

  return redirect(
    `/x/accounting/categories`,
    await flash(request, success("Created G/L account subcategory"))
  );
}
