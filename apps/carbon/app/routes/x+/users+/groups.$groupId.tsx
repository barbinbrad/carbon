import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  GroupForm,
  getGroupMembers,
  groupValidator,
  upsertGroup,
  upsertGroupMembers,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const { groupId } = params;
  if (!groupId) throw notFound("groupId not found");

  const groupWithMembers = await getGroupMembers(client, groupId);

  if (groupWithMembers.error) {
    redirect(
      "/x/users/groups",
      await flash(
        request,
        error(groupWithMembers.error, "Failed to load group")
      )
    );
  }

  const groupName = groupWithMembers.data?.[0].name;
  if (!groupName)
    return redirect(
      "/x/users/groups",
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

export async function action({ request }: ActionArgs) {
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
      "/x/users/groups",
      await flash(request, error(updateGroup.error, "Failed to update group"))
    );

  if (updateGroupMembers.error)
    redirect(
      "/x/users/groups",
      await flash(
        request,
        error(updateGroupMembers.error, "Failed to update group members")
      )
    );

  return redirect(
    "/x/users/groups",
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
