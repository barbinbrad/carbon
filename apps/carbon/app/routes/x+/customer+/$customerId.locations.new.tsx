import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  CustomerLocationForm,
  customerLocationValidator,
  insertCustomerLocation,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "sales",
  });

  const { customerId } = params;
  if (!customerId) throw notFound("customerId not found");

  const validation = await customerLocationValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, addressId, ...address } = validation.data;

  const createCustomerLocation = await insertCustomerLocation(client, {
    customerId,
    address,
  });
  if (createCustomerLocation.error) {
    return redirect(
      `/x/customer/${customerId}/locations`,
      await flash(
        request,
        error(
          createCustomerLocation.error,
          "Failed to create customer location"
        )
      )
    );
  }

  return redirect(
    `/x/customer/${customerId}/locations`,
    await flash(request, success("Customer location created"))
  );
}

export default function CustomerLocationsNewRoute() {
  const initialValues = {};

  return <CustomerLocationForm initialValues={initialValues} />;
}
