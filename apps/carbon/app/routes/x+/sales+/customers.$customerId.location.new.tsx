import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  insertCustomerLocation,
  customerLocationValidator,
} from "~/services/sales";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
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
      `/x/sales/customers/${customerId}`,
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
    `/x/sales/customers/${customerId}`,
    await flash(request, success("Customer location created"))
  );
}
