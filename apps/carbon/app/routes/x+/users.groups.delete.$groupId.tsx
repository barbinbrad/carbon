import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { requirePermissions } from "~/services/auth";
import { deleteGroup, getGroup } from "~/services/users";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const group = await getGroup(client, groupId);
  if (group.error) {
    return redirect(
      "/x/users/groups",
      await flash(request, error(group.error, "Failed to get group"))
    );
  }

  return json(group);
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "users",
  });

  const { groupId } = params;
  if (!groupId) {
    return redirect(
      "/x/users/groups",
      await flash(request, error(params, "Failed to get an group id"))
    );
  }

  const { error: deleteGroupError } = await deleteGroup(client, groupId);
  if (deleteGroupError) {
    return redirect(
      "/x/users/groups",
      await flash(request, error(deleteGroupError, "Failed to delete group"))
    );
  }

  return redirect(
    "/x/users/groups",
    await flash(request, success("Successfully deleted group"))
  );
}

export default function DeleteEmployeeTypeRoute() {
  const { groupId } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!groupId || !data) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/users/groups");

  return (
    <ConfirmDelete
      action={`/x/users/groups/delete/${groupId}`}
      name={data.name}
      text={`Are you sure you want to delete the group: ${data.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
