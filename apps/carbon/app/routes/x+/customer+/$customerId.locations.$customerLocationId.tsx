import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  CustomerLocationForm,
  customerLocationValidator,
  getCustomerLocation,
  updateCustomerLocation,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { customerId, customerLocationId } = params;
  if (!customerId) throw notFound("customerId not found");
  if (!customerLocationId) throw notFound("customerLocationId not found");

  const location = await getCustomerLocation(client, customerLocationId);
  if (location.error) {
    return redirect(
      path.customerLocations(customerId),
      await flash(
        request,
        error(location.error, "Failed to get customer location")
      )
    );
  }

  return json({
    location: location.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "sales",
  });

  const { customerId, customerLocationId } = params;
  if (!customerId) throw notFound("customerId not found");
  if (!customerLocationId) throw notFound("customerLocationId not found");

  const validation = await customerLocationValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, addressId, ...address } = validation.data;

  if (addressId === undefined)
    throw badRequest("addressId is undefined in form data");

  const update = await updateCustomerLocation(client, {
    addressId,
    address,
  });
  if (update.error) {
    return redirect(
      path.customerLocations(customerId),
      await flash(
        request,
        error(update.error, "Failed to update customer address")
      )
    );
  }

  return redirect(
    path.customerLocations(customerId),
    await flash(request, success("Customer address updated"))
  );
}

export default function EditCustomerLocationRoute() {
  const { location } = useLoaderData<typeof loader>();

  const initialValues = {
    id: location?.id ?? undefined,
    addressId: location?.address?.id ?? undefined,

    addressLine1: location?.address?.addressLine1 ?? "",
    addressLine2: location?.address?.addressLine2 ?? "",
    city: location?.address?.city ?? "",
    state: location?.address?.state ?? "",
    postalCode: location?.address?.postalCode ?? "",
  };

  return <CustomerLocationForm initialValues={initialValues} />;
}
