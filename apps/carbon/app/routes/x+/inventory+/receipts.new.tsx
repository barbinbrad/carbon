import { getLocalTimeZone, today } from "@internationalized/date";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import type { ReceiptSourceDocument } from "~/modules/inventory";
import {
  ReceiptForm,
  receiptValidator,
  upsertReceipt,
} from "~/modules/inventory";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {
    create: "inventory",
  });

  const nextSequence = await getNextSequence(client, "receipt", userId);
  if (nextSequence.error) {
    return redirect(
      "/x/receipts/new",
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const insertReceipt = await upsertReceipt(client, {
    receiptId: nextSequence.data,
    sourceDocumentId: "",
    createdBy: userId,
  });
  if (insertReceipt.error) {
    await rollbackNextSequence(client, "receipt", userId);
    return redirect(
      "/x/receipts",
      await flash(
        request,
        error(insertReceipt.error, "Failed to generate receipt")
      )
    );
  }

  return json({
    receipt: {
      id: insertReceipt.data.id,
      receiptId: nextSequence.data,
    },
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "inventory",
  });

  const validation = await receiptValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, receiptId, ...data } = validation.data;

  const nextSequence = await getNextSequence(client, "receipt", userId);
  if (nextSequence.error) {
    return redirect(
      "/x/receipts/new",
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const insertReceipt = await upsertReceipt(client, {
    ...data,
    receiptId: nextSequence.data,
    createdBy: userId,
  });
  if (insertReceipt.error) {
    await rollbackNextSequence(client, "receipt", userId);
    return json(
      {},
      await flash(
        request,
        error(insertReceipt.error, "Failed to insert receipt")
      )
    );
  }

  return redirect(
    "/x/inventory/receipts",
    await flash(request, success("Receipt created"))
  );
}

export default function NewReceiptsRoute() {
  const { receipt } = useLoaderData<typeof loader>();
  const initialValues = {
    ...receipt,
    sourceDocument: "Purchase Order" as ReceiptSourceDocument,
    sourceDocumentId: "",
    postingDate: today(getLocalTimeZone()).toString(),
  };

  return (
    <ReceiptForm
      // @ts-expect-error --> TODO: remove this when we use the whole enum in inventory.form
      initialValues={initialValues}
      isPosted={false}
      receiptItems={[]}
    />
  );
}
