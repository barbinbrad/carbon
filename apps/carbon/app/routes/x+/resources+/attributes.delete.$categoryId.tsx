import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteAttributeCategory } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    update: "resources",
  });

  const { categoryId } = params;
  if (!categoryId) {
    return redirect(
      "/x/resources/attributes",
      await flash(request, error(params, "Failed to get a category id"))
    );
  }

  const deactivateAttribute = await deleteAttributeCategory(client, categoryId);
  if (deactivateAttribute.error) {
    return redirect(
      "/x/resources/attributes",
      await flash(
        request,
        error(
          deactivateAttribute.error,
          "Failed to deactivate attribute category"
        )
      )
    );
  }

  return redirect(
    "/x/resources/attributes",
    await flash(request, success("Successfully deactivated attribute category"))
  );
}
