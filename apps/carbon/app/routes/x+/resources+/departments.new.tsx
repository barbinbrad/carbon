import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  DepartmentForm,
  departmentValidator,
  upsertDepartment,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(departmentValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createDepartment = await upsertDepartment(client, {
    ...data,
    createdBy: userId,
  });

  if (createDepartment.error) {
    return redirect(
      path.to.departments,
      await flash(
        request,
        error(createDepartment.error, "Failed to create department.")
      )
    );
  }

  return redirect(
    path.to.departments,
    await flash(request, success("Department created."))
  );
}

export default function NewDepartmentRoute() {
  const initialValues = {
    name: "",
    color: "#000000",
  };

  return <DepartmentForm initialValues={initialValues} />;
}
