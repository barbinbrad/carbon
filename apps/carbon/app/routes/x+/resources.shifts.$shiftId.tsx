import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { ShiftForm } from "~/interfaces/Resources/Shifts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getShift, shiftValidator, upsertShift } from "~/services/resources";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";
import { getLocalTimeZone } from "@internationalized/date";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { shiftId } = params;
  if (!shiftId) throw notFound("Shift ID was not found");

  const shift = await getShift(client, shiftId);

  if (shift.error) {
    return redirect(
      "/x/resources/shifts",
      await flash(request, error(shift.error, "Failed to get shift"))
    );
  }

  return json({
    shift: shift.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await shiftValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const createShift = await upsertShift(client, {
    ...validation.data,
  });

  if (createShift.error) {
    return redirect(
      "/x/resources/shifts",
      await flash(request, error(createShift.error, "Failed to create shift."))
    );
  }

  return redirect(
    "/x/resources/shifts",
    await flash(request, success("Shift updated."))
  );
}

export default function ShiftRoute() {
  const { shift } = useLoaderData<typeof loader>();

  if (Array.isArray(shift?.location)) {
    throw new Error("Shift location is an array");
  }

  const initialValues = {
    id: shift.id,
    name: shift.name,
    startTime: shift.startTime,
    endTime: shift.endTime,
    locationId: shift.locationId,
  };

  return <ShiftForm initialValues={initialValues} />;
}
