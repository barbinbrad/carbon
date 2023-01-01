import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteAttribute } from "~/services/users";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    update: "users",
  });

  const { attributeId } = params;
  if (!attributeId) {
    return redirect(
      "/app/users/attributes",
      await flash(request, error(params, "Failed to get an attribute id"))
    );
  }

  const deactivateAttribute = await deleteAttribute(client, attributeId);
  if (deactivateAttribute.error) {
    return redirect(
      "/app/users/attributes",
      await flash(
        request,
        error(deactivateAttribute.error, "Failed to deactivate attribute")
      )
    );
  }

  return redirect(
    "/app/users/attributes",
    await flash(request, success("Successfully deactivated attribute"))
  );
}
