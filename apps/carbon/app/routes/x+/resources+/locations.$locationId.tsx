import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { LocationForm } from "~/interfaces/Resources/Locations";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  getLocation,
  locationValidator,
  upsertLocation,
} from "~/services/resources";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";
import { getLocalTimeZone } from "@internationalized/date";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { locationId } = params;
  if (!locationId) throw notFound("Location ID was not found");

  const location = await getLocation(client, locationId);

  if (location.error) {
    return redirect(
      "/x/resources/locations",
      await flash(request, error(location.error, "Failed to get location"))
    );
  }

  return json({
    location: location.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await locationValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, timezone, latitude, longitude } = validation.data;

  const createLocation = await upsertLocation(client, {
    id,
    name,
    timezone,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
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
    await flash(request, success("Location updated."))
  );
}

export default function LocationRoute() {
  const { location } = useLoaderData<typeof loader>();

  const initialValues = {
    id: location.id,
    name: location.name,
    timezone: location.timezone ?? getLocalTimeZone(),
    latitude: location.latitude ?? undefined,
    longitude: location.longitude ?? undefined,
  };

  return <LocationForm initialValues={initialValues} />;
}
