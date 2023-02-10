import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteNote } from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    update: "resources",
  });

  const { noteId, personId } = params;
  if (!noteId) {
    return redirect(
      "/x/resources/people",
      await flash(request, error(params, "Failed to get a note id"))
    );
  }
  if (!personId) {
    return redirect(
      "/x/resources/people",
      await flash(request, error(params, "Failed to get a person id"))
    );
  }

  const removeNote = await deleteNote(client, noteId);
  if (removeNote.error) {
    return redirect(
      `/x/resources/person/${personId}`,
      await flash(request, error(removeNote.error, "Failed to delete note"))
    );
  }

  return redirect(
    `/x/resources/person/${personId}`,
    await flash(request, success("Successfully deleted note"))
  );
}
