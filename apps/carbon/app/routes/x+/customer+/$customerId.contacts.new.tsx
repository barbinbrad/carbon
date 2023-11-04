import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { getSupabaseServiceRole } from "~/lib/supabase";
import {
  CustomerContactForm,
  customerContactValidator,
  insertCustomerContact,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  await requirePermissions(request, {
    create: "sales",
  });

  // RLS doesn't work for selecting a contact with no customer
  const client = getSupabaseServiceRole();

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
      path.to.customerContacts(customerId),
      await flash(
        request,
        error(createCustomerContact.error, "Failed to create customer contact")
      )
    );
  }

  return redirect(
    path.to.customerContacts(customerId),
    await flash(request, success("Customer contact created"))
  );
}

export default function CustomerContactsNewRoute() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
  };

  return <CustomerContactForm initialValues={initialValues} />;
}
