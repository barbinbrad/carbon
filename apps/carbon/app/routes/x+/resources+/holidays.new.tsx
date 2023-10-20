import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  HolidayForm,
  holidayValidator,
  upsertHoliday,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
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
      path.to.holidays,
      await flash(
        request,
        error(createHoliday.error, "Failed to create holiday.")
      )
    );
  }

  return redirect(
    path.to.holidays,
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
