import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { ShippingCarrier } from "~/modules/inventory";
import {
  ShippingMethodForm,
  shippingMethodValidator,
  upsertShippingMethod,
} from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    create: "inventory",
  });

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "inventory",
  });

  const validation = await shippingMethodValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, carrier, carrierAccountId, trackingUrl } = validation.data;

  const insertShippingMethod = await upsertShippingMethod(client, {
    name,
    carrier,
    carrierAccountId,
    trackingUrl,
    createdBy: userId,
  });
  if (insertShippingMethod.error) {
    return json(
      {},
      await flash(
        request,
        error(insertShippingMethod.error, "Failed to insert shipping method")
      )
    );
  }

  const shippingMethodId = insertShippingMethod.data[0]?.id;
  if (!shippingMethodId) {
    return json(
      {},
      await flash(
        request,
        error(insertShippingMethod, "Failed to insert shipping method")
      )
    );
  }

  return redirect(
    "/x/inventory/shipping-methods",
    await flash(request, success("Shipping method created"))
  );
}

export default function NewShippingMethodsRoute() {
  const routeData = useRouteData<{
    accounts: { name: string; number: string }[];
  }>("/x/inventory/shipping-methods");

  const initialValues = {
    name: "",
    carrier: "" as ShippingCarrier,
  };

  return (
    <ShippingMethodForm
      initialValues={initialValues}
      accounts={routeData?.accounts ?? []}
    />
  );
}
