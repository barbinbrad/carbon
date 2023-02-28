import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { ShiftForm } from "~/interfaces/Resources/Shifts";
import { requirePermissions } from "~/services/auth";
import { shiftValidator, upsertShift } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

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
  };

  return <ShiftForm initialValues={initialValues} />;
}
