import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { insertNote, noteValidator } from "~/modules/shared";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {});

  const validation = await noteValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { documentId, note } = validation.data;
  const createNote = await insertNote(client, {
    documentId,
    note,
    createdBy: userId,
  });
  if (createNote.error) {
    throw redirect(
      request.headers.get("Referer") ?? "/x",
      await flash(request, error(createNote.error, "Error creating note"))
    );
  }

  return redirect(request.headers.get("Referer") ?? "/x");
}
