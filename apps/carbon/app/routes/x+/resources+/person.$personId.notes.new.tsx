import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "react-router";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import { insertNote, noteValidator } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId: createdBy } = await requirePermissions(request, {
    create: "resources",
  });

  const { personId: userId } = params;
  if (!userId) throw new Error("Missing personId");

  const validation = await noteValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { note } = validation.data;

  const createNote = await insertNote(client, {
    userId,
    note,
    createdBy,
  });

  if (createNote.error) {
    return json(
      {},
      await flash(request, error(createNote.error, "Failed to create note"))
    );
  }

  return redirect(
    `/x/resources/person/${userId}`,
    await flash(request, success("Sucessfully created note"))
  );
}
