import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  createCustomerAccount,
  createCustomerValidator,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { CreateCustomerModal } from "~/interfaces/Users/Customers";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await createCustomerValidator.validate(
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

  return redirect("/app/users/customers", await flash(request, result));
}

export default function () {
  return <CreateCustomerModal />;
}
