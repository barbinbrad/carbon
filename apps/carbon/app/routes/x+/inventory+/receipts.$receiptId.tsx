import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  ReceiptForm,
  getReceipt,
  getReceiptLines,
  receiptValidator,
  upsertReceipt,
} from "~/modules/inventory";
import { getNotes } from "~/modules/shared";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee",
  });

  const { receiptId } = params;
  if (!receiptId) throw notFound("receiptId not found");

  const [receipt, receiptLines, notes] = await Promise.all([
    getReceipt(client, receiptId),
    getReceiptLines(client, receiptId),
    getNotes(client, receiptId),
  ]);

  return json({
    receipt: receipt?.data ?? null,
    receiptLines: receiptLines?.data ?? [],
    notes: notes?.data ?? [],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "inventory",
  });

  const validation = await receiptValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("id not found");

  const updateReceipt = await upsertReceipt(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updateReceipt.error) {
    return json(
      {},
      await flash(
        request,
        error(updateReceipt.error, "Failed to update receipt")
      )
    );
  }

  return redirect(
    path.to.receipt(id),
    await flash(request, success("Updated receipt"))
  );
}

export default function EditReceiptsRoute() {
  const { receipt, receiptLines, notes } = useLoaderData<typeof loader>();

  if (receipt === null) {
    throw new Error("Receipt not found");
  }

  const initialValues = {
    ...receipt,
    receiptId: receipt.receiptId ?? undefined,
    externalDocumentId: receipt.externalDocumentId ?? undefined,
    sourceDocument: (receipt.sourceDocument ??
      "Purchase Order") as "Purchase Order",
    sourceDocumentId: receipt.sourceDocumentId ?? undefined,
    sourceDocumentReadbleId: receipt.sourceDocumentReadableId ?? undefined,
    locationId: receipt.locationId ?? undefined,
  };

  return (
    <ReceiptForm
      // @ts-ignore
      initialValues={initialValues}
      isPosted={!!receipt?.postingDate ?? false}
      notes={notes}
      receiptLines={receiptLines}
    />
  );
}
