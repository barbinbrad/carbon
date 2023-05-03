import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  DocumentForm,
  documentValidator,
  getDocument,
} from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "documents",
  });

  const { documentId } = params;
  if (!documentId) throw notFound("documentId not found");

  const document = await getDocument(client, documentId);

  if (document.error) {
    return redirect(
      "/x/documents/search",
      await flash(request, error(document.error, "Failed to get document"))
    );
  }

  return json({
    document: document.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  // const { client } = await requirePermissions(request, {
  //   update: "documents",
  // });

  const validation = await documentValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  console.log(validation.data);

  return redirect(
    "/x/documents/search",
    await flash(request, success("Updated document"))
  );
}

export default function EditDocumentRoute() {
  const { document } = useLoaderData<typeof loader>();

  let name = document.name;
  if (name) name = name.split(".").slice(0, -1).join(".");

  const initialValues = {
    id: document.id ?? "",
    name: name ?? "",
    description: document.description ?? "",
    type: document.type ?? "",
    size: document.size ?? 0,
    readGroups: document.readGroups ?? [],
    writeGroups: document.writeGroups ?? [],
  };

  return (
    <DocumentForm
      initialValues={initialValues}
      ownerId={document.createdBy ?? ""}
    />
  );
}
