import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  createCustomerAccount,
  createCustomerAccountValidator,
  CreateCustomerModal,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "sales",
    update: "users",
  });

  const validation = await createCustomerAccountValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, customer } = validation.data;
  const result = await createCustomerAccount(client, {
    id,
    customerId: customer,
  });

  return redirect("/x/users/customers", await flash(request, result));
}

export default function () {
  return <CreateCustomerModal />;
}
