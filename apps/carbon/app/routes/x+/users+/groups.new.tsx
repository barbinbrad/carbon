import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import {
  GroupForm,
  deleteGroup,
  groupValidator,
  insertGroup,
  upsertGroupMembers,
} from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const validation = await validator(groupValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, selections } = validation.data;

  const createGroup = await insertGroup(client, { name });
  if (createGroup.error) {
    return json(
      {},
      await flash(request, error(createGroup.error, "Failed to insert group"))
    );
  }

  const groupId = createGroup.data?.id;
  if (!groupId) {
    return json(
      {},
      await flash(request, error(createGroup, "Failed to insert group"))
    );
  }

  const insertGroupMembers = await upsertGroupMembers(
    client,
    groupId,
    selections
  );

  if (insertGroupMembers.error) {
    await deleteGroup(client, groupId);
    return json(
      {},
      await flash(
        request,
        error(insertGroupMembers.error, "Failed to insert group members")
      )
    );
  }

  return redirect(
    path.to.groups,
    await flash(request, success("Group created"))
  );
}

export default function NewGroupRoute() {
  const initialValues = {
    id: "",
    name: "",
    selections: [],
  };

  return <GroupForm initialValues={initialValues} />;
}
