import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  HolidayForm,
  getHoliday,
  holidayValidator,
  upsertHoliday,
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

  const { holidayId } = params;
  if (!holidayId) throw notFound("Holiday ID was not found");

  const holiday = await getHoliday(client, holidayId);

  if (holiday.error) {
    return redirect(
      path.to.holidays,
      await flash(request, error(holiday.error, "Failed to get holiday"))
    );
  }

  return json({
    holiday: holiday.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await validator(holidayValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, date } = validation.data;
  if (!id) throw notFound("Holiday ID was not found");

  const updateHoliday = await upsertHoliday(client, {
    id,
    name,
    date,
    updatedBy: userId,
  });

  if (updateHoliday.error) {
    return redirect(
      path.to.holidays,
      await flash(
        request,
        error(updateHoliday.error, "Failed to create holiday.")
      )
    );
  }

  return redirect(
    path.to.holidays,
    await flash(request, success("Holiday updated."))
  );
}

export default function HolidayRoute() {
  const { holiday } = useLoaderData<typeof loader>();

  const initialValues = {
    id: holiday.id,
    name: holiday.name,
    date: holiday.date,
  };

  return <HolidayForm key={initialValues.id} initialValues={initialValues} />;
}
