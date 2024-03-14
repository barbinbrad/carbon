import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
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

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(departmentValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createDepartment = await upsertDepartment(client, {
    ...data,
    createdBy: userId,
  });

  if (createDepartment.error) {
    return modal
      ? json(
          createDepartment,
          await flash(
            request,
            error(createDepartment.error, "Failed to insert department")
          )
        )
      : redirect(
          path.to.departments,
          await flash(
            request,
            error(createDepartment.error, "Failed to create department.")
          )
        );
  }

  return modal
    ? json(createDepartment, { status: 201 })
    : redirect(
        path.to.departments,
        await flash(request, success("Department created."))
      );
}

export default function NewDepartmentRoute() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  return (
    <DepartmentForm
      onClose={() => navigate(-1)}
      initialValues={initialValues}
    />
  );
}
