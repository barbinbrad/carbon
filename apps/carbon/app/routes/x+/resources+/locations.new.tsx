import { getLocalTimeZone } from "@internationalized/date";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { LocationForm } from "~/interfaces/Resources/Locations";
import { requirePermissions } from "~/services/auth";
import { locationValidator, upsertLocation } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await locationValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, timezone, latitude, longitude } = validation.data;

  const createLocation = await upsertLocation(client, {
    name,
    timezone,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    createdBy: userId,
  });

  if (createLocation.error) {
    return redirect(
      "/x/resources/locations",
      await flash(
        request,
        error(createLocation.error, "Failed to create location.")
      )
    );
  }

  return redirect(
    "/x/resources/locations",
    await flash(request, success("Location created."))
  );
}

export default function NewLocationRoute() {
  const initialValues = {
    name: "",
    timezone: getLocalTimeZone(),
  };

  return <LocationForm initialValues={initialValues} />;
}
