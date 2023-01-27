import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { EmployeeTypeForm } from "~/interfaces/Users/EmployeeTypes";
import { requirePermissions } from "~/services/auth";
import {
  employeeTypeValidator,
  getEmployeeType,
  getPermissionsByEmployeeType,
  makePermissionsFromEmployeeType,
  employeeTypePermissionsValidator,
  upsertEmployeeType,
  upsertEmployeeTypePermissions,
} from "~/services/users";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const { employeeTypeId } = params;
  if (!employeeTypeId) throw notFound("employeeTypeId not found");

  const [employeeType, employeeTypePermissions] = await Promise.all([
    getEmployeeType(client, employeeTypeId),
    getPermissionsByEmployeeType(client, employeeTypeId),
  ]);

  if (employeeType?.data?.protected) {
    return redirect(
      "/x/users/employee-types",
      await flash(request, error(null, "Cannot edit a protected employee type"))
    );
  }

  return json({
    employeeType,
    employeeTypePermissions: makePermissionsFromEmployeeType(
      employeeTypePermissions.data ?? []
    ),
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await employeeTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, color, data } = validation.data;

  const permissions = JSON.parse(data);
  const jsonValidation =
    employeeTypePermissionsValidator.safeParse(permissions);
  if (jsonValidation.success === false) {
    return json(
      {},
      await flash(
        request,
        error(jsonValidation.error, "Failed to parse permissions")
      )
    );
  }

  const updateEmployeeType = await upsertEmployeeType(client, {
    id,
    name,
    color: color || null,
  });

  if (updateEmployeeType.error) {
    return json(
      {},
      await flash(
        request,
        error(updateEmployeeType.error, "Failed to update employee type")
      )
    );
  }

  const updateEmployeeTypePermissions = await upsertEmployeeTypePermissions(
    client,
    id,
    permissions
  );

  if (updateEmployeeTypePermissions.error) {
    return json(
      {},
      await flash(
        request,
        error(
          updateEmployeeTypePermissions.error,
          "Failed to update employee type permissions"
        )
      )
    );
  }

  return redirect(
    "/x/users/employee-types",
    await flash(request, success("Updated employee type"))
  );
}

export default function EditEmployeeTypesRoute() {
  const { employeeType, employeeTypePermissions } =
    useLoaderData<typeof loader>();

  const initialValues = {
    id: employeeType.data?.id ?? "",
    name: employeeType.data?.name ?? "",
    color: employeeType.data?.color ?? "#000000",
    permissions: employeeTypePermissions,
  };

  return <EmployeeTypeForm initialValues={initialValues} />;
}
