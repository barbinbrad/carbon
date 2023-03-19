import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  GroupForm,
  insertGroup,
  deleteGroup,
  groupValidator,
  upsertGroupMembers,
} from "~/modules/users";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";
import { requirePermissions } from "~/services/auth";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const validation = await groupValidator.validate(await request.formData());

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

  const groupId = createGroup.data[0]?.id;
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
    "/x/users/groups",
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
