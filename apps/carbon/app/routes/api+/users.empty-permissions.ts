import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getFeatures } from "~/modules/users";
import { makeEmptyPermissionsFromFeatures } from "~/modules/users/users.server";
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
