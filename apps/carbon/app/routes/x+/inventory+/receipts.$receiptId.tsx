import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getReceipt,
  getReceiptLines,
  ReceiptForm,
  receiptValidator,
  upsertReceipt,
} from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
    role: "employee",
  });

  const { receiptId } = params;
  if (!receiptId) throw notFound("receiptId not found");

  const [receipt, receiptLines] = await Promise.all([
    getReceipt(client, receiptId),
    getReceiptLines(client, receiptId),
  ]);

  return json({
    receipt: receipt?.data ?? null,
    receiptLines: receiptLines?.data ?? [],
  });
}

export async function action({ request }: ActionArgs) {
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
    `/x/inventory/receipts/${id}`,
    await flash(request, success("Updated receipt"))
  );
}

export default function EditReceiptsRoute() {
  const { receipt, receiptLines } = useLoaderData<typeof loader>();
  if (!receipt?.receiptId) throw notFound("receiptId not found");
  if (!receipt?.sourceDocumentId) throw notFound("sourceDocumentId not found");

  const initialValues = {
    ...receipt,
    receiptId: receipt.receiptId ?? undefined,
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
      receiptLines={receiptLines}
    />
  );
}
