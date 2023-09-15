import { Box } from "@chakra-ui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useUrlParams } from "~/hooks";
import type {
  PurchaseOrderStatus,
  PurchaseOrderType,
} from "~/modules/purchasing";
import {
  PurchaseOrderForm,
  purchaseOrderValidator,
  upsertPurchaseOrder,
} from "~/modules/purchasing";
import { getNextSequence, rollbackNextSequence } from "~/modules/settings";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const validation = await purchaseOrderValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const nextSequence = await getNextSequence(client, "purchaseOrder", userId);
  if (nextSequence.error) {
    return redirect(
      "/x/purchase-order/new",
      await flash(
        request,
        error(nextSequence.error, "Failed to get next sequence")
      )
    );
  }

  const createPurchaseOrder = await upsertPurchaseOrder(client, {
    ...validation.data,
    purchaseOrderId: nextSequence.data,
    createdBy: userId,
  });

  if (createPurchaseOrder.error) {
    // TODO: this should be done as a transaction
    await rollbackNextSequence(client, "purchaseOrder", userId);
    return redirect(
      "/x/purchasing/orders",
      await flash(
        request,
        error(createPurchaseOrder.error, "Failed to insert purchase order")
      )
    );
  }

  const order = createPurchaseOrder.data?.[0];

  return redirect(
    `/x/purchase-order/${order?.id}`,
    await flash(
      request,
      success(`Created purchase order ${order?.purchaseOrderId}`)
    )
  );
}

export default function PurchaseOrderNewRoute() {
  const [params] = useUrlParams();
  const supplierId = params.get("supplierId");
  const initialValues = {
    id: undefined,
    purchaseOrderId: undefined,
    supplierId: supplierId ?? undefined,
    orderDate: today(getLocalTimeZone()).toString(),
    status: "Draft" as PurchaseOrderStatus,
    type: "Purchase" as PurchaseOrderType,
  };

  return (
    <Box w="50%" maxW={720} minW={420}>
      <PurchaseOrderForm
        // @ts-expect-error
        initialValues={initialValues}
      />
    </Box>
  );
}
