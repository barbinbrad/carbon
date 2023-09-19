import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  customerLocationValidator,
  updateCustomerLocation,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

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

  if (!addressId) throw badRequest("addressId is undefined in form data");

  const update = await updateCustomerLocation(client, {
    addressId,
    address,
  });
  if (update.error) {
    return redirect(
      `/x/sales/customers/${customerId}`,
      await flash(
        request,
        error(update.error, "Failed to update customer address")
      )
    );
  }

  return redirect(
    `/x/sales/customers/${customerId}`,
    await flash(request, success("Customer address updated"))
  );
}
