import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { requirePermissions } from "~/services/auth";
import { deleteDepartment, getDepartment } from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { departmentId } = params;
  if (!departmentId) throw notFound("departmentId not found");

  const department = await getDepartment(client, departmentId);
  if (department.error) {
    return redirect(
      "/x/resources/departments",
      await flash(request, error(department.error, "Failed to get department"))
    );
  }

  return json({
    department: department.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { departmentId } = params;
  if (!departmentId) {
    return redirect(
      "/x/resources/departments",
      await flash(request, error(params, "Failed to get department id"))
    );
  }

  const { error: deleteDepartmentError } = await deleteDepartment(
    client,
    departmentId
  );
  if (deleteDepartmentError) {
    return redirect(
      "/x/resources/departments",
      await flash(
        request,
        error(deleteDepartmentError, "Failed to delete department")
      )
    );
  }

  return redirect(
    "/x/resources/departments",
    await flash(request, success("Successfully deleted department"))
  );
}

export default function DeleteDepartmentRoute() {
  const { departmentId } = useParams();
  const { department } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!departmentId || !department) return null;

  const onCancel = () => navigate("/x/resources/departments");

  return (
    <ConfirmDelete
      action={`/x/resources/departments/delete/${departmentId}`}
      name={department.name}
      text={`Are you sure you want to delete the department: ${department.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
