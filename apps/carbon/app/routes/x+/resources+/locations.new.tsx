import { validationError, validator } from "@carbon/remix-validated-form";
import { getLocalTimeZone } from "@internationalized/date";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  LocationForm,
  locationValidator,
  upsertLocation,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(locationValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createLocation = await upsertLocation(client, {
    ...data,
    createdBy: userId,
  });

  if (createLocation.error) {
    return redirect(
      path.to.locations,
      await flash(
        request,
        error(createLocation.error, "Failed to create location.")
      )
    );
  }

  return redirect(
    path.to.locations,
    await flash(request, success("Location created"))
  );
}

export default function NewLocationRoute() {
  const initialValues = {
    name: "",
    timezone: getLocalTimeZone(),
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  };

  return <LocationForm initialValues={initialValues} />;
}
