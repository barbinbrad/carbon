import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteDepartment, getDepartment } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { departmentId } = params;
  if (!departmentId) throw notFound("departmentId not found");

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

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { departmentId } = params;
  if (!departmentId) {
    return redirect(
      path.to.departments,
      await flash(request, error(params, "Failed to get department id"))
    );
  }

  const { error: deleteDepartmentError } = await deleteDepartment(
    client,
    departmentId
  );
  if (deleteDepartmentError) {
    return redirect(
      path.to.departments,
      await flash(
        request,
        error(deleteDepartmentError, "Failed to delete department")
      )
    );
  }

  return redirect(
    path.to.departments,
    await flash(request, success("Successfully deleted department"))
  );
}

export default function DeleteDepartmentRoute() {
  const { departmentId } = useParams();
  const { department } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!departmentId || !department) return null;

  const onCancel = () => navigate(path.to.departments);

  return (
    <ConfirmDelete
      action={`/x/resources/departments/delete/${departmentId}`}
      name={department.name}
      text={`Are you sure you want to delete the department: ${department.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
