import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/router";
import { getFeatures, makeEmptyPermissionsFromFeatures } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const features = await getFeatures(authorized.client);
  if (features.error || features.data === null) {
    return json(
      {
        permissions: {},
      },
      await flash(request, error(features.error, "Failed to fetch features"))
    );
  }

  return json({
    permissions: makeEmptyPermissionsFromFeatures(features.data),
  });
}
