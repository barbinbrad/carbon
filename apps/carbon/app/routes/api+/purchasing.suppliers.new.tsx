import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { insertSupplier, supplierValidator } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await validator(supplierValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createSupplier = await insertSupplier(client, {
    ...data,
    createdBy: userId,
  });
  if (createSupplier.error) {
    return json(
      createSupplier,
      await flash(
        request,
        error(createSupplier.error, "Failed to insert supplier")
      )
    );
  }

  return json(createSupplier);
}
