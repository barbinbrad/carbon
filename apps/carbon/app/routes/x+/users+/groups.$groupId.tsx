import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getGroupMembers,
  GroupForm,
  groupValidator,
  upsertGroup,
  upsertGroupMembers,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const groupWithMembers = await getGroupMembers(client, groupId);

  if (groupWithMembers.error) {
    redirect(
      path.to.groups,
      await flash(
        request,
        error(groupWithMembers.error, "Failed to load group")
      )
    );
  }

  const groupName = groupWithMembers.data?.[0].name;
  if (!groupName)
    return redirect(
      path.to.groups,
      await flash(request, error(groupWithMembers, "Group not found"))
    );

  const group = {
    id: groupId,
    name: groupName,
    selections:
      groupWithMembers.data?.map((group) =>
        group.memberGroupId
          ? `group_${group.memberGroupId}`
          : `user_${group.memberUserId}`
      ) || [],
  };

  return json({ group });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const validation = await groupValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, selections } = validation.data;

  const [updateGroup, updateGroupMembers] = await Promise.all([
    upsertGroup(client, { id, name }),
    upsertGroupMembers(client, id, selections),
  ]);

  if (updateGroup.error)
    redirect(
      path.to.groups,
      await flash(request, error(updateGroup.error, "Failed to update group"))
    );

  if (updateGroupMembers.error)
    redirect(
      path.to.groups,
      await flash(
        request,
        error(updateGroupMembers.error, "Failed to update group members")
      )
    );

  return redirect(
    path.to.groups,
    await flash(request, success("Group updated successfully"))
  );
}

export default function UsersGroupRoute() {
  const { group } = useLoaderData<typeof loader>();

  const initialValues = {
    id: group?.id || "",
    name: group?.name || "",
    selections: group?.selections || [],
  };

  return <GroupForm initialValues={initialValues} />;
}
