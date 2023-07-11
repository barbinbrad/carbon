import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import {
  AccountSubcategoryForm,
  getAccountSubcategory,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
    role: "employee",
  });

  const { categoryId, subcategoryId } = params;
  if (!subcategoryId) throw notFound("subcategoryId not found");

  const subcategory = await getAccountSubcategory(client, subcategoryId);
  if (subcategory.error) {
    return redirect(
      `/x/accounting/categories/list/${categoryId}`,
      await flash(
        request,
        error(subcategory.error, "Failed to fetch G/L account subcategory")
      )
    );
  }

  return json({
    subcategory: subcategory.data,
  });
}

export default function EditAccountSubcategoryRoute() {
  const { subcategory } = useLoaderData<typeof loader>();
  const { categoryId } = useParams();
  if (!categoryId) throw notFound("categoryId not found");

  const navigate = useNavigate();
  const onClose = () => navigate(`/x/accounting/categories/list/${categoryId}`);

  const initialValues = {
    ...subcategory,
  };

  return (
    <AccountSubcategoryForm initialValues={initialValues} onClose={onClose} />
  );
}
