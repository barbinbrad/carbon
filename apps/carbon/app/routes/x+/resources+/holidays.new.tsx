import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { HolidayForm } from "~/interfaces/Resources/Holidays";
import { requirePermissions } from "~/services/auth";
import { holidayValidator, upsertHoliday } from "~/services/resources";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await holidayValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, date } = validation.data;

  const createHoliday = await upsertHoliday(client, {
    name,
    date,
    createdBy: userId,
  });

  if (createHoliday.error) {
    return redirect(
      "/x/resources/holidays",
      await flash(
        request,
        error(createHoliday.error, "Failed to create holiday.")
      )
    );
  }

  return redirect(
    "/x/resources/holidays",
    await flash(request, success("Holiday created."))
  );
}

export default function NewHolidayRoute() {
  const initialValues = {
    name: "",
    date: undefined,
  };

  return (
    <HolidayForm
      // @ts-expect-error
      initialValues={initialValues}
    />
  );
}
