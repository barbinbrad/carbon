import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteDocument } from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    delete: "documents",
  });

  const { documentId } = params;
  if (!documentId) throw notFound("documentId not found");

  const moveToTrash = await deleteDocument(client, documentId);

  if (moveToTrash.error) {
    return redirect(
      "/x/documents/search",
      await flash(
        request,
        error(moveToTrash.error, "Failed to delete document")
      )
    );
  }

  return redirect("/x/documents/search");
}