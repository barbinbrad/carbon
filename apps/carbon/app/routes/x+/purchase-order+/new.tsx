import { Box } from "@chakra-ui/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type {
  PurchaseOrderApprovalStatus,
  PurchaseOrderType,
} from "~/modules/purchasing";
import {
  PurchaseOrderForm,
  purchaseOrderValidator,
  upsertPurchaseOrder,
} from "~/modules/purchasing";
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

  const createPurchaseOrder = await upsertPurchaseOrder(client, {
    ...validation.data,
    createdBy: userId,
  });
  if (createPurchaseOrder.error) {
    return redirect(
      "/x/purchasing/orders",
      await flash(
        request,
        error(createPurchaseOrder.error, "Failed to insert purchase order")
      )
    );
  }

  const { id, purchaseOrderId } = createPurchaseOrder.data[0];

  return redirect(
    `/x/purchase-order/${id}`,
    await flash(request, success(`Created purchase order ${purchaseOrderId}`))
  );
}

export default function PurchaseOrderNewRoute() {
  const routeData = useRouteData<{
    purchaseOrderApprovalStatuses: PurchaseOrderApprovalStatus[];
    purchaseOrderTypes: PurchaseOrderType[];
  }>("/x/purchase-order");

  const initialValues = {
    id: undefined,
    purchaseOrderId: undefined,
    status: "Draft" as PurchaseOrderApprovalStatus,
    type: "Purchase" as PurchaseOrderType,
  };

  return (
    <Box maxW={720}>
      <PurchaseOrderForm
        initialValues={initialValues}
        purchaseOrderApprovalStatuses={
          routeData?.purchaseOrderApprovalStatuses ?? []
        }
        purchaseOrderTypes={routeData?.purchaseOrderTypes ?? []}
      />
    </Box>
  );
}
