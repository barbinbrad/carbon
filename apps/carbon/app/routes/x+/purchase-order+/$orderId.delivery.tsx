import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getShippingMethodsList,
  getShippingTermsList,
} from "~/modules/inventory";
import {
  getPurchaseOrderDelivery,
  PurchaseOrderDeliveryForm,
  purchaseOrderDeliveryValidator,
  upsertPurchaseOrderDelivery,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  const [purchaseOrderDelivery, shippingMethods, shippingTerms] =
    await Promise.all([
      getPurchaseOrderDelivery(client, orderId),
      getShippingMethodsList(client),
      getShippingTermsList(client),
    ]);

  if (purchaseOrderDelivery.error) {
    return redirect(
      `/x/purchase-order/${orderId}`,
      await flash(
        request,
        error(
          purchaseOrderDelivery.error,
          "Failed to load purchase order delivery"
        )
      )
    );
  }

  if (shippingMethods.error) {
    return redirect(
      "/x/purchasing/orders",
      await flash(
        request,
        error(shippingMethods.error, "Failed to load shipping methods")
      )
    );
  }

  if (shippingTerms.error) {
    return redirect(
      "/x/purchasing/orders",
      await flash(
        request,
        error(shippingTerms.error, "Failed to load shipping terms")
      )
    );
  }

  return json({
    purchaseOrderDelivery: purchaseOrderDelivery.data,
    shippingMethods: shippingMethods.data ?? [],
    shippingTerms: shippingTerms.data ?? [],
  });
}

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  // validate with purchasingValidator
  const validation = await purchaseOrderDeliveryValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const updatePurchaseOrderDelivery = await upsertPurchaseOrderDelivery(
    client,
    {
      ...validation.data,
      id: orderId,
      updatedBy: userId,
    }
  );
  if (updatePurchaseOrderDelivery.error) {
    return redirect(
      `/x/purchase-order/${orderId}`,
      await flash(
        request,
        error(
          updatePurchaseOrderDelivery.error,
          "Failed to update purchase order delivery"
        )
      )
    );
  }

  return redirect(
    `/x/purchase-order/${orderId}/delivery`,
    await flash(request, success("Updated purchase order delivery"))
  );
}

export default function PurchaseOrderDeliveryRoute() {
  const { purchaseOrderDelivery, shippingMethods, shippingTerms } =
    useLoaderData<typeof loader>();

  const initialValues = {
    id: purchaseOrderDelivery.id,
    shippingMethodId: purchaseOrderDelivery.shippingMethodId ?? "",
    shippingTermId: purchaseOrderDelivery.shippingTermId ?? "",
    trackingNumber: purchaseOrderDelivery.trackingNumber ?? "",
    receiptRequestedDate: purchaseOrderDelivery.receiptRequestedDate ?? "",
    receiptPromisedDate: purchaseOrderDelivery.receiptPromisedDate ?? "",
    deliveryDate: purchaseOrderDelivery.deliveryDate ?? "",
    notes: purchaseOrderDelivery.notes ?? "",
    dropShipment: purchaseOrderDelivery.dropShipment ?? false,
    customerId: purchaseOrderDelivery.customerId ?? "",
    customerLocationId: purchaseOrderDelivery.customerLocationId ?? "",
  };

  return (
    <PurchaseOrderDeliveryForm
      initialValues={initialValues}
      shippingMethods={shippingMethods}
      shippingTerms={shippingTerms}
    />
  );
}
