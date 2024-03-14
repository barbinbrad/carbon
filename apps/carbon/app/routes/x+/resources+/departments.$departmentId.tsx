import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  DepartmentForm,
  departmentValidator,
  getDepartment,
  upsertDepartment,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { departmentId } = params;
  if (!departmentId) throw notFound("Department ID was not found");

  const department = await getDepartment(client, departmentId);

  if (department.error) {
    return redirect(
      path.to.departments,
      await flash(request, error(department.error, "Failed to get department"))
    );
  }

  return json({
    department: department.data,
  });
}

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
  if (!id) throw notFound("Department ID was not found");

  const updateDepartment = await upsertDepartment(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updateDepartment.error) {
    return redirect(
      path.to.departments,
      await flash(
        request,
        error(updateDepartment.error, "Failed to create department.")
      )
    );
  }

  return redirect(
    path.to.departments,
    await flash(request, success("Department updated."))
  );
}

export default function DepartmentRoute() {
  const { department } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const initialValues = {
    id: department.id,
    name: department.name,
    parentDepartmentId: department.parentDepartmentId ?? undefined,
  };

  return (
    <DepartmentForm
      onClose={() => navigate(-1)}
      key={initialValues.id}
      initialValues={initialValues}
    />
  );
}
