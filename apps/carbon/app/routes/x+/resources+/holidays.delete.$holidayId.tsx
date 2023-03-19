import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteHoliday, getHoliday } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { holidayId } = params;
  if (!holidayId) throw notFound("holidayId not found");

  const holiday = await getHoliday(client, holidayId);
  if (holiday.error) {
    return redirect(
      "/x/resources/holidays",
      await flash(request, error(holiday.error, "Failed to get holiday"))
    );
  }

  return json({
    holiday: holiday.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { holidayId } = params;
  if (!holidayId) {
    return redirect(
      "/x/resources/holidays",
      await flash(request, error(params, "Failed to get holiday id"))
    );
  }

  const { error: deleteHolidayError } = await deleteHoliday(client, holidayId);
  if (deleteHolidayError) {
    return redirect(
      "/x/resources/holidays",
      await flash(
        request,
        error(deleteHolidayError, "Failed to delete holiday")
      )
    );
  }

  return redirect(
    "/x/resources/holidays",
    await flash(request, success("Successfully deleted holiday"))
  );
}

export default function DeleteHolidayRoute() {
  const { holidayId } = useParams();
  const { holiday } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!holidayId || !holiday) return null;

  const onCancel = () => navigate("/x/resources/holidays");

  return (
    <ConfirmDelete
      action={`/x/resources/holidays/delete/${holidayId}`}
      name={holiday.name}
      text={`Are you sure you want to delete the holiday: ${holiday.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
