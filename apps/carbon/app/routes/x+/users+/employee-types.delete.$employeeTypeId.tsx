import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteEmployeeType, getEmployeeType } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });
  const { employeeTypeId } = params;
  if (!employeeTypeId) throw notFound("EmployeeTypeId not found");

  const employeeType = await getEmployeeType(client, employeeTypeId);
  if (employeeType.error) {
    return redirect(
      "/x/users/employee-types",
      await flash(
        request,
        error(employeeType.error, "Failed to get employee type")
      )
    );
  }

  return json({
    employeeType: employeeType.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "users",
  });

  const { employeeTypeId } = params;
  if (!employeeTypeId) {
    return redirect(
      "/x/users/employee-types",
      await flash(request, error(params, "Failed to get an employee type id"))
    );
  }

  const { error: deleteTypeError } = await deleteEmployeeType(
    client,
    employeeTypeId
  );
  if (deleteTypeError) {
    return redirect(
      "/x/users/employee-types",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete employee type")
      )
    );
  }

  // TODO - delete employeeType group

  return redirect(
    "/x/users/employee-types",
    await flash(request, success("Successfully deleted employee type"))
  );
}

export default function DeleteEmployeeTypeRoute() {
  const { employeeTypeId } = useParams();
  const { employeeType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!employeeTypeId || !employeeType) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/users/employee-types");

  return (
    <ConfirmDelete
      action={`/x/users/employee-types/delete/${employeeTypeId}`}
      name={employeeType.name}
      text={`Are you sure you want to delete the employee type: ${employeeType.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
