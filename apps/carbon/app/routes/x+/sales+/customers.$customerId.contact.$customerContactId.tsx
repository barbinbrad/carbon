import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  updateCustomerContact,
  customerContactValidator,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, badRequest, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "sales",
  });

  const { customerId, customerContactId } = params;
  if (!customerId) throw notFound("customerId not found");
  if (!customerContactId) throw notFound("customerContactId not found");

  const validation = await customerContactValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, contactId, ...contact } = validation.data;

  if (id !== customerContactId)
    throw badRequest("customerContactId does not match id from form data");

  if (contactId === undefined)
    throw badRequest("contactId is undefined from form data");

  const update = await updateCustomerContact(client, {
    contactId,
    contact,
  });
  if (update.error) {
    return redirect(
      `/x/sales/customers/${customerId}`,
      await flash(
        request,
        error(update.error, "Failed to update customer contact")
      )
    );
  }

  return redirect(
    `/x/sales/customers/${customerId}`,
    await flash(request, success("Customer contact updated"))
  );
}
