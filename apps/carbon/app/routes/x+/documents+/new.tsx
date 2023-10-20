import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { upsertDocument } from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {});
  const formData = await request.formData();

  const documentPath = formData.get("path");
  const name = formData.get("name");

  if (typeof documentPath !== "string") throw new Error("Invalid path");
  if (typeof name !== "string") throw new Error("Invalid name");

  const size = Number(formData.get("size"));

  const createDocument = await upsertDocument(client, {
    path: documentPath,
    name,
    size,
    readGroups: [userId],
    writeGroups: [userId],
    createdBy: userId,
  });
  if (createDocument.error) {
    return redirect(
      path.to.documents,
      await flash(
        request,
        error(createDocument.error, "Failed to create document")
      )
    );
  }

  return redirect(
    path.to.documents,
    await flash(request, success(`Successfully uploaded ${name}`))
  );
}
