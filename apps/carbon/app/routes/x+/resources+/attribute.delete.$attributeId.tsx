import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteAttribute } from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    update: "resources",
  });

  const { attributeId } = params;
  if (!attributeId) {
    return redirect(
      "/x/resources/attributes",
      await flash(request, error(params, "Failed to get an attribute id"))
    );
  }

  const deactivateAttribute = await deleteAttribute(client, attributeId);
  if (deactivateAttribute.error) {
    return redirect(
      "/x/resources/attributes",
      await flash(
        request,
        error(deactivateAttribute.error, "Failed to deactivate attribute")
      )
    );
  }

  return redirect(
    "/x/resources/attributes",
    await flash(request, success("Successfully deactivated attribute"))
  );
}
