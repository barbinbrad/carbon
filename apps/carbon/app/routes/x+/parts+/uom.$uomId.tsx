import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  UnitOfMeasureForm,
  getUnitOfMeasure,
  unitOfMeasureValidator,
  upsertUnitOfMeasure,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
    role: "employee",
  });

  const { uomId } = params;
  if (!uomId) throw notFound("uomId not found");

  const unitOfMeasure = await getUnitOfMeasure(client, uomId);

  return json({
    unitOfMeasure: unitOfMeasure?.data ?? null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const validation = await validator(unitOfMeasureValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, code } = validation.data;
  if (!id) throw notFound("id not found");

  const updateUnitOfMeasure = await upsertUnitOfMeasure(client, {
    id,
    name,
    code,
    updatedBy: userId,
  });

  if (updateUnitOfMeasure.error) {
    return json(
      {},
      await flash(
        request,
        error(updateUnitOfMeasure.error, "Failed to update unit of measure")
      )
    );
  }

  return redirect(
    path.to.uoms,
    await flash(request, success("Updated unit of measure"))
  );
}

export default function EditUnitOfMeasuresRoute() {
  const { unitOfMeasure } = useLoaderData<typeof loader>();

  const initialValues = {
    id: unitOfMeasure?.id ?? undefined,
    name: unitOfMeasure?.name ?? "",
    code: unitOfMeasure?.code ?? "",
  };

  return (
    <UnitOfMeasureForm key={initialValues.id} initialValues={initialValues} />
  );
}
