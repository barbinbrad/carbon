import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { deleteUserAttributeValue } from "~/services/account";
import { getAttribute } from "~/services/people";
import { getPermissions } from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);

  const { client, userId } = await requirePermissions(request, {});
  const { userId: targetUserId } = params;

  if (!targetUserId) {
    throw new Error("No user id provided");
  }

  const formData = await request.formData();

  const userAttributeId = formData.get("userAttributeId") as string;
  if (!userAttributeId || Number.isNaN(Number(userAttributeId)))
    throw new Error("No attribute id provided");

  const userAttributeValueId = formData.get("userAttributeValueId") as string;
  if (!userAttributeValueId || Number.isNaN(Number(userAttributeValueId)))
    throw new Error("No attribute value id provided");

  const clientPermissions = await getPermissions(request, client);
  const canUpdateAnyUser = clientPermissions["users"]?.update === true;

  if (!canUpdateAnyUser && userId !== targetUserId) {
    return json(
      null,
      await flash(request, error(null, "Unauthorized: Cannot remove attribute"))
    );
  }

  if (!canUpdateAnyUser && userId === targetUserId) {
    // check if this is a self managed attribute
    const attribute = await getAttribute(client, Number(userAttributeId));
    if (attribute.error) {
      return json(
        null,
        await flash(request, error(attribute.error, "Failed to get attribute"))
      );
    }

    const canSelfManage = attribute.data?.canSelfManage ?? false;
    if (!canSelfManage) {
      return json(
        null,
        await flash(
          request,
          error(null, "Unauthorized: Cannot remove attribute")
        )
      );
    }
  }

  const removeAttributeValue = await deleteUserAttributeValue(client, {
    userId,
    userAttributeId: Number(userAttributeId),
    userAttributeValueId: Number(userAttributeValueId),
  });
  if (removeAttributeValue.error) {
    return json(
      null,
      await flash(
        request,
        error(removeAttributeValue.error, "Failed to delete attribute value")
      )
    );
  }

  return json(null, await flash(request, success("Deleted attribute value")));
}

export default function UserAttributeValueRoute() {
  // Remix bug
  return null;
}
