import { validationError, validator } from "@carbon/remix-validated-form";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { updateRequestForQuoteFavorite } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { favoriteSchema } from "~/types/validators";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    view: "purchasing",
  });

  const validation = await validator(favoriteSchema).validate(
    await request.formData()
  );
  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, favorite } = validation.data;

  const result = await updateRequestForQuoteFavorite(client, {
    id,
    favorite: favorite === "favorite",
    userId,
  });

  if (result.error) {
    return json(
      {},
      await flash(request, error(result, "Failed to favorite RFQ"))
    );
  }

  return json({});
}
