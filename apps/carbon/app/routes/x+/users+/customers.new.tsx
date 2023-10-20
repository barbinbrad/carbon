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
import { path } from "~/utils/path";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await createCustomerAccountValidator.validate(
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
