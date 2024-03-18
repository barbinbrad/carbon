import type { LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { deleteCustomField } from "~/modules/settings/settings.server";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "settings",
  });

  const { tableId, id } = params;
  if (!tableId) throw new Error("tableId is not found");
  if (!id) throw new Error("id is not found");

  const deleteField = await deleteCustomField(client, id);
  if (deleteField.error) {
    return redirect(
      path.to.attributes,
      await flash(
        request,
        error(deleteField.error, "Failed to delete custom field")
      )
    );
  }

  return redirect(
    path.to.customFieldList(tableId),
    await flash(request, success("Successfully deleted custom field"))
  );
}
