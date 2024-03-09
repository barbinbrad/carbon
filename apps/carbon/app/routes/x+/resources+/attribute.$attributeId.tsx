import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { attributeValidator, updateAttribute } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await validator(attributeValidator).validate(
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
      path.to.attributes,
      await flash(request, error(update.error, "Failed to update attribute"))
    );

  return redirect(
    path.to.attributes,
    await flash(request, success("Successfully updated attribtue"))
  );
}
