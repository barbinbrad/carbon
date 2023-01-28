import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { AttributeCategoryForm } from "~/interfaces/People/Attributes";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  attributeCategoryValidator,
  getAttributeCategory,
  updateAttributeCategory,
} from "~/services/people";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "people",
    role: "employee",
  });

  const { categoryId } = params;
  if (!categoryId) throw notFound("Invalid categoryId");

  const attributeCategory = await getAttributeCategory(client, categoryId);
  if (attributeCategory.error) {
    return redirect(
      "/x/people/attributes",
      await flash(
        request,
        error(attributeCategory.error, "Failed to fetch attribute category")
      )
    );
  }

  return json({ attributeCategory: attributeCategory.data });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "people",
  });

  const validation = await attributeCategoryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, isPublic } = validation.data;
  if (!id) throw new Error("ID is was not found");

  const updateCategory = await updateAttributeCategory(client, {
    id,
    name,
    public: isPublic,
    updatedBy: userId,
  });
  if (updateCategory.error) {
    return redirect(
      "/x/people/attributes",
      await flash(
        request,
        error(updateCategory.error, "Failed to update attribute category")
      )
    );
  }

  return redirect(
    "/x/people/attributes",
    await flash(request, success("Updated attribute category "))
  );
}

export default function EditAttributeCategoryRoute() {
  const { attributeCategory } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const onClose = () => navigate("/x/people/attributes/");

  const initialValues = {
    id: attributeCategory?.id,
    name: attributeCategory?.name ?? "",
    isPublic: attributeCategory?.public ?? false,
  };

  return (
    <AttributeCategoryForm onClose={onClose} initialValues={initialValues} />
  );
}
