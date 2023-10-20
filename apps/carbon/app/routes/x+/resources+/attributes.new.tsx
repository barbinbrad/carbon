import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  AttributeCategoryForm,
  attributeCategoryValidator,
  insertAttributeCategory,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "resources",
  });

  const validation = await attributeCategoryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, isPublic } = validation.data;

  const createAttributeCategory = await insertAttributeCategory(client, {
    name,
    public: isPublic,
    createdBy: userId,
  });
  if (createAttributeCategory.error) {
    return redirect(
      path.to.attributes,
      await flash(
        request,
        error(
          createAttributeCategory.error,
          "Failed to create attribute category"
        )
      )
    );
  }

  return redirect(path.to.attributes);
}

export default function NewAttributeCategoryRoute() {
  const navigate = useNavigate();
  const onClose = () => navigate(path.to.attributes);

  const initialValues = {
    name: "",
    isPublic: false,
  };

  return (
    <AttributeCategoryForm onClose={onClose} initialValues={initialValues} />
  );
}
