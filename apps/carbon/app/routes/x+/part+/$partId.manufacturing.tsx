import { validationError, validator } from "@carbon/remix-validated-form";
import { useLoaderData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import {
  PartManufacturingForm,
  getPartManufacturing,
  partManufacturingValidator,
  upsertPartManufacturing,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { getCustomFields, setCustomFields } from "~/utils/form";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const partManufacturing = await getPartManufacturing(client, partId);

  if (partManufacturing.error) {
    return redirect(
      path.to.parts,
      await flash(
        request,
        error(
          partManufacturing.error,
          "Failed to load part manufacturingturing"
        )
      )
    );
  }

  return json({
    partManufacturing: partManufacturing.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "parts",
  });

  const { partId } = params;
  if (!partId) throw new Error("Could not find partId");

  const formData = await request.formData();
  const validation = await validator(partManufacturingValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePartManufacturing = await upsertPartManufacturing(client, {
    ...validation.data,
    partId,
    updatedBy: userId,
    customFields: setCustomFields(formData),
  });
  if (updatePartManufacturing.error) {
    return redirect(
      path.to.part(partId),
      await flash(
        request,
        error(
          updatePartManufacturing.error,
          "Failed to update part manufacturing"
        )
      )
    );
  }

  return redirect(
    path.to.partManufacturing(partId),
    await flash(request, success("Updated part manufacturing"))
  );
}

export default function PartManufacturingRoute() {
  const { partManufacturing } = useLoaderData<typeof loader>();

  const initialValues = {
    ...partManufacturing,
    lotSize: partManufacturing.lotSize ?? 0,
    ...getCustomFields(partManufacturing.customFields),
  };

  return (
    <PartManufacturingForm
      key={initialValues.partId}
      initialValues={initialValues}
    />
  );
}
