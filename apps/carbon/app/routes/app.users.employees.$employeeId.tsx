import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { EmployeePermissionsForm } from "~/interfaces/Users/Employees";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  userPermissionsValidator,
  employeeValidator,
  getClaimsById,
  getEmployeeById,
  makePermissionsFromClaims,
  updateEmployee,
} from "~/services/users";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const { employeeId } = params;
  if (!employeeId) throw notFound("EmployeeId was not found");

  const [claims, employee] = await Promise.all([
    getClaimsById(client, employeeId),
    getEmployeeById(client, employeeId),
  ]);

  if (claims.error || employee.error || claims.data === null) {
    redirect(
      "/app/users/employees",
      await flash(
        request,
        error(
          { claims: claims.error, employee: employee.error },
          "Failed to load employee"
        )
      )
    );
  }

  const permissions = makePermissionsFromClaims(claims?.data);
  if (permissions === null) {
    redirect(
      "/app/users/employees",
      await flash(request, error(claims.data, "Failed to parse claims"))
    );
  }

  return json({
    permissions,
    employee: employee.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await employeeValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, employeeType, data } = validation.data;
  const permissions = JSON.parse(data);
  if (
    !Object.values(permissions).every(
      (permission) => userPermissionsValidator.safeParse(permission).success
    )
  ) {
    return json(
      {},
      await flash(request, error(permissions, "Failed to parse permissions"))
    );
  }

  const result = await updateEmployee(client, {
    id,
    employeeType,
    permissions,
  });

  return redirect("/app/users/employees", await flash(request, result));
}

export default function UsersEmployeeRoute() {
  const { permissions, employee } = useLoaderData<typeof loader>();

  if (Array.isArray(employee?.user) || Array.isArray(employee?.employeeType)) {
    throw new Error("Expected single user and employee type");
  }

  const initialValues = {
    id: employee?.id || "",
    employeeType: employee?.employeeType?.id || "",
    permissions: permissions || {},
  };

  return (
    <EmployeePermissionsForm
      name={`${employee?.user?.firstName} ${employee?.user?.lastName}`}
      initialValues={initialValues}
    />
  );
}
