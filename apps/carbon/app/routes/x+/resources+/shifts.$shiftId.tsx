import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  ShiftForm,
  getShift,
  shiftValidator,
  upsertShift,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { shiftId } = params;
  if (!shiftId) throw notFound("Shift ID was not found");

  const shift = await getShift(client, shiftId);

  if (shift.error) {
    return redirect(
      path.to.shifts,
      await flash(request, error(shift.error, "Failed to get shift"))
    );
  }

  return json({
    shift: shift.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(shiftValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const createShift = await upsertShift(client, {
    ...validation.data,
  });

  if (createShift.error) {
    return redirect(
      path.to.shifts,
      await flash(request, error(createShift.error, "Failed to create shift"))
    );
  }

  return redirect(
    path.to.shifts,
    await flash(request, success("Shift updated"))
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
    monday: shift.monday,
    tuesday: shift.tuesday,
    wednesday: shift.wednesday,
    thursday: shift.thursday,
    friday: shift.friday,
    saturday: shift.saturday,
    sunday: shift.sunday,
  };

  return <ShiftForm key={initialValues.id} initialValues={initialValues} />;
}
