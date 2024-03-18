import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import {
  CreateCustomerModal,
  createCustomerAccountValidator,
} from "~/modules/users";
import { createCustomerAccount } from "~/modules/users/users.server";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await validator(createCustomerAccountValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const customerRedirect = searchParams.get("customer");

  const { id, customer } = validation.data;
  const result = await createCustomerAccount(client, {
    id,
    customerId: customer,
  });

  if (customerRedirect) {
    return redirect(
      path.to.customerContacts(customerRedirect),
      await flash(request, result)
    );
  }

  return redirect(path.to.customerAccounts, await flash(request, result));
}

export default function () {
  return <CreateCustomerModal />;
}
