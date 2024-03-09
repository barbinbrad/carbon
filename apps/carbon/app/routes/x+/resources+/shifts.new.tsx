import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ShiftForm, shiftValidator, upsertShift } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

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
      await flash(request, error(createShift.error, "Failed to create shift."))
    );
  }

  return redirect(
    path.to.shifts,
    await flash(request, success("Shift created."))
  );
}

export default function NewShiftRoute() {
  const initialValues = {
    name: "",
    locationId: "",
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
    startTime: "08:00",
    endTime: "17:00",
  };

  return <ShiftForm initialValues={initialValues} />;
}
