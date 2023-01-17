import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  updateCustomerLocation,
  customerLocationValidator,
} from "~/services/sales";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
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

  if (id !== Number(customerLocationId))
    throw badRequest("customerLocationId does not match id from form data");

  if (addressId === undefined)
    throw badRequest("addressId is undefined from form data");

  const update = await updateCustomerLocation(client, {
    addressId,
    address,
  });
  if (update.error) {
    return redirect(
      `/app/sales/customers/${customerId}`,
      await flash(
        request,
        error(update.error, "Failed to update customer address")
      )
    );
  }

  return redirect(
    `/app/sales/customers/${customerId}`,
    await flash(request, success("Customer address updated"))
  );
}
