import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getSequence,
  SequenceForm,
  sequenceValidator,
  updateSequence,
} from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "settings",
    role: "employee",
  });

  const { tableId } = params;
  if (!tableId) throw notFound("tableId not found");

  const sequence = await getSequence(client, tableId);
  if (sequence.error) {
    return redirect(
      path.to.sequences,
      await flash(request, error(sequence.error, "Failed to get sequence"))
    );
  }

  return json({
    sequence: sequence?.data ?? null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "settings",
  });

  const validation = await sequenceValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { table, ...data } = validation.data;

  const update = await updateSequence(client, table, {
    ...data,
    updatedBy: userId,
  });

  if (update.error) {
    return json(
      {},
      await flash(request, error(update.error, "Failed to update sequence"))
    );
  }

  return redirect(
    path.to.sequences,
    await flash(request, success("Updated sequence"))
  );
}

export default function EditSequenceRoute() {
  const { sequence } = useLoaderData<typeof loader>();

  const initialValues = {
    table: sequence?.table ?? "",
    name: sequence?.name ?? "",
    prefix: sequence?.prefix ?? "",
    next: sequence?.next ?? 1,
    size: sequence?.size ?? 5,
    step: sequence?.step ?? 1,
    suffix: sequence?.suffix ?? "",
  };

  return <SequenceForm initialValues={initialValues} />;
}
