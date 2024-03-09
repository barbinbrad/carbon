import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { customerValidator, insertCustomer } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await validator(customerValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createCustomer = await insertCustomer(client, {
    ...data,
    createdBy: userId,
  });
  if (createCustomer.error) {
    return json(
      createCustomer,
      await flash(
        request,
        error(createCustomer.error, "Failed to insert customer")
      )
    );
  }

  return json(createCustomer, { status: 201 });
}
