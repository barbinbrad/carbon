import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteNote } from "~/modules/shared";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {});

  const { noteId } = params;
  if (!noteId) throw new Error("noteId not found");

  const result = await deleteNote(client, noteId);
  if (result.error) {
    throw redirect(
      request.headers.get("Referer") ?? request.url,
      await flash(request, error(result.error, "Error deleting note"))
    );
  }

  return redirect(request.headers.get("Referer") ?? request.url);
}
