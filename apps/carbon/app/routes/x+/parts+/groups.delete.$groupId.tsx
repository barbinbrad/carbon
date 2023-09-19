import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deletePartGroup, getPartGroup } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });
  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const partGroup = await getPartGroup(client, groupId);
  if (partGroup.error) {
    return redirect(
      "/x/parts/groups",
      await flash(request, error(partGroup.error, "Failed to get part group"))
    );
  }

  return json({ partGroup: partGroup.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "parts",
  });

  const { groupId } = params;
  if (!groupId) {
    return redirect(
      "/x/parts/groups",
      await flash(request, error(params, "Failed to get an part group id"))
    );
  }

  const { error: deleteTypeError } = await deletePartGroup(client, groupId);
  if (deleteTypeError) {
    return redirect(
      "/x/parts/groups",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete part group")
      )
    );
  }

  return redirect(
    "/x/parts/groups",
    await flash(request, success("Successfully deleted part group"))
  );
}

export default function DeletePartGroupRoute() {
  const { groupId } = useParams();
  const { partGroup } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!groupId || !partGroup) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/parts/groups");

  return (
    <ConfirmDelete
      action={`/x/parts/groups/delete/${groupId}`}
      name={partGroup.name}
      text={`Are you sure you want to delete the part group: ${partGroup.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
