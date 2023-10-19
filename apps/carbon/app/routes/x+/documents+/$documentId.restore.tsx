import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { restoreDocument } from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    delete: "documents",
  });

  const { documentId } = params;
  if (!documentId) throw notFound("documentId not found");

  const removeFromTrash = await restoreDocument(client, documentId, userId);

  if (removeFromTrash.error) {
    return redirect(
      path.documents,
      await flash(
        request,
        error(removeFromTrash.error, "Failed to restore document")
      )
    );
  }

  return redirect(path.documentsTrash);
}
