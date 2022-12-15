import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  createEmployeeAccount,
  createEmployeeValidator,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { CreateEmployeeModal } from "~/modules/Users/Employees";

export async function action({ request }: ActionArgs) {
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

  return redirect("/app/users/employees", await flash(request, result));
}

export default function () {
  return <CreateEmployeeModal />;
}
