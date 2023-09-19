import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  createEmployeeAccount,
  CreateEmployeeModal,
  createEmployeeValidator,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const validation = await createEmployeeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email, firstName, lastName, employeeType } = validation.data;
  const result = await createEmployeeAccount(client, {
    email,
    firstName,
    lastName,
    employeeType,
  });

  return redirect("/x/users/employees", await flash(request, result));
}

export default function () {
  return <CreateEmployeeModal />;
}
