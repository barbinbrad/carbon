import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { ShippingCarrier } from "~/modules/inventory";
import {
  ShippingMethodForm,
  shippingMethodValidator,
  upsertShippingMethod,
} from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "inventory",
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
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

  const shippingMethodId = insertShippingMethod.data?.id;
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
    path.to.shippingMethods,
    await flash(request, success("Shipping method created"))
  );
}

export default function NewShippingMethodsRoute() {
  const initialValues = {
    name: "",
    carrier: "" as ShippingCarrier,
  };

  return <ShippingMethodForm initialValues={initialValues} />;
}
