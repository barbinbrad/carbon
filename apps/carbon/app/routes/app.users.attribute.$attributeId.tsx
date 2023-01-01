import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { attributeValidator, updateAttribute } from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await attributeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await updateAttribute(client, {
    ...validation.data,
    updatedBy: userId,
  });
  if (update.error)
    redirect(
      "/app/users/attributes",
      await flash(request, error(update.error, "Failed to update attribute"))
    );

  return redirect(
    "/app/users/attributes",
    await flash(request, success("Successfully updated attribtue"))
  );
}
