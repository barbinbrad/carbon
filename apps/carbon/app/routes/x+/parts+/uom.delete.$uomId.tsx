import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteUnitOfMeasure, getUnitOfMeasure } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });
  const { uomId } = params;
  if (!uomId) throw notFound("uomId not found");

  const unitOfMeasure = await getUnitOfMeasure(client, uomId);
  if (unitOfMeasure.error) {
    return redirect(
      path.to.uom,
      await flash(
        request,
        error(unitOfMeasure.error, "Failed to get unit of measure")
      )
    );
  }

  return json({ unitOfMeasure: unitOfMeasure.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "parts",
  });

  const { uomId } = params;
  if (!uomId) {
    return redirect(
      path.to.uom,
      await flash(request, error(params, "Failed to get an unit of measure id"))
    );
  }

  const { error: deleteTypeError } = await deleteUnitOfMeasure(client, uomId);
  if (deleteTypeError) {
    return redirect(
      path.to.uom,
      await flash(
        request,
        error(deleteTypeError, "Failed to delete unit of measure")
      )
    );
  }

  return redirect(
    path.to.uom,
    await flash(request, success("Successfully deleted unit of measure"))
  );
}

export default function DeleteUnitOfMeasureRoute() {
  const { uomId } = useParams();
  const { unitOfMeasure } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!uomId || !unitOfMeasure) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate(path.to.uom);

  return (
    <ConfirmDelete
      action={`/x/parts/uom/delete/${uomId}`}
      name={unitOfMeasure.name}
      text={`Are you sure you want to delete the unit of measure: ${unitOfMeasure.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
