import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requirePermissions } from "~/services/auth";
import {
  insertCustomerContact,
  customerContactValidator,
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

  const validation = await customerContactValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, contactId, ...contact } = validation.data;

  const createCustomerContact = await insertCustomerContact(client, {
    customerId,
    contact,
  });
  if (createCustomerContact.error) {
    return redirect(
      `/x/sales/customers/${customerId}`,
      await flash(
        request,
        error(createCustomerContact.error, "Failed to create customer contact")
      )
    );
  }

  return redirect(
    `/x/sales/customers/${customerId}`,
    await flash(request, success("Customer contact created"))
  );
}
