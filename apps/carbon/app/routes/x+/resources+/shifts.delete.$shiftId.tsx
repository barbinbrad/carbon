import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteShift, getShift } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { shiftId } = params;
  if (!shiftId) throw notFound("shiftId not found");

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

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { shiftId } = params;
  if (!shiftId) {
    return redirect(
      "/x/resources/shifts",
      await flash(request, error(params, "Failed to get shift id"))
    );
  }

  const { error: deleteShiftError } = await deleteShift(client, shiftId);
  if (deleteShiftError) {
    return redirect(
      "/x/resources/shifts",
      await flash(request, error(deleteShiftError, "Failed to delete shift"))
    );
  }

  return redirect(
    "/x/resources/shifts",
    await flash(request, success("Successfully deleted shift"))
  );
}

export default function DeleteShiftRoute() {
  const { shiftId } = useParams();
  const { shift } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!shiftId || !shift) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/resources/shifts");
  if (Array.isArray(shift.location))
    throw new Error("Shift location is an array");

  return (
    <ConfirmDelete
      action={`/x/resources/shifts/delete/${shiftId}`}
      name={shift.name}
      text={`Are you sure you want to delete the shift: ${shift.name} from ${
        shift.location?.name ?? "unknown location"
      }? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
