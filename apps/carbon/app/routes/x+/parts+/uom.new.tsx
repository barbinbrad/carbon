import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  UnitOfMeasureForm,
  unitOfMeasureValidator,
  upsertUnitOfMeasure,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "parts",
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await unitOfMeasureValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, code } = validation.data;

  const insertUnitOfMeasure = await upsertUnitOfMeasure(client, {
    name,
    code,
    createdBy: userId,
  });
  if (insertUnitOfMeasure.error) {
    return json(
      {},
      await flash(
        request,
        error(insertUnitOfMeasure.error, "Failed to insert unit of measure")
      )
    );
  }

  const unitOfMeasureId = insertUnitOfMeasure.data?.id;
  if (!unitOfMeasureId) {
    return json(
      {},
      await flash(
        request,
        error(insertUnitOfMeasure, "Failed to insert unit of measure")
      )
    );
  }

  return redirect(
    path.to.uom,
    await flash(request, success("Unit of measure created"))
  );
}

export default function NewUnitOfMeasuresRoute() {
  const initialValues = {
    name: "",
    code: "",
  };

  return <UnitOfMeasureForm initialValues={initialValues} />;
}
