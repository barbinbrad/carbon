import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  DepartmentForm,
  departmentValidator,
  upsertDepartment,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await departmentValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, color, parentDepartmentId } = validation.data;

  const createDepartment = await upsertDepartment(client, {
    name,
    color,
    parentDepartmentId,
    createdBy: userId,
  });

  if (createDepartment.error) {
    return redirect(
      "/x/resources/departments",
      await flash(
        request,
        error(createDepartment.error, "Failed to create department.")
      )
    );
  }

  return redirect(
    "/x/resources/departments",
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
