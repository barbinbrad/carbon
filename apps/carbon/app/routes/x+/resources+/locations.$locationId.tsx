import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  LocationForm,
  getLocation,
  locationValidator,
  upsertLocation,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
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
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await locationValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw notFound("Location ID was not found");

  const createLocation = await upsertLocation(client, {
    id,
    ...data,
    updatedBy: userId,
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
    addressLine1: location.addressLine1 ?? undefined,
    addressLine2: location.addressLine2 ?? undefined,
    city: location.city ?? undefined,
    state: location.state ?? undefined,
    postalCode: location.postalCode ?? undefined,
    timezone: location.timezone ?? getLocalTimeZone(),
    latitude: location.latitude ?? undefined,
    longitude: location.longitude ?? undefined,
  };

  return <LocationForm initialValues={initialValues} />;
}
