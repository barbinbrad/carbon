import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { AttributeCategoryForm } from "~/interfaces/Resources/Attributes";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  attributeCategoryValidator,
  insertAttributeCategory,
} from "~/services/resources";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
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
      "/x/resources/people/attributes",
      await flash(
        request,
        error(
          createAttributeCategory.error,
          "Failed to create attribute category"
        )
      )
    );
  }

  return redirect(
    "/x/resources/people/attributes",
    await flash(request, success("Created attribute category "))
  );
}

export default function NewAttributeCategoryRoute() {
  const navigate = useNavigate();
  const onClose = () => navigate("/x/resources/people/attributes");

  const initialValues = {
    name: "",
    isPublic: false,
  };

  return (
    <AttributeCategoryForm onClose={onClose} initialValues={initialValues} />
  );
}
