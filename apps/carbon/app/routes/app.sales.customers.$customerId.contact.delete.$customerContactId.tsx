import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";
import { deleteCustomerContact } from "~/services/sales";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "sales",
  });

  const { customerId, customerContactId } = params;
  if (!customerId || !customerContactId) {
    return redirect(
      "/app/sales/customers",
      await flash(request, error(params, "Failed to get a customer contact id"))
    );
  }

  const { error: deleteCustomerContactError } = await deleteCustomerContact(
    client,
    customerId,
    Number(customerContactId)
  );
  if (deleteCustomerContactError) {
    return redirect(
      `/app/sales/customers/${customerId}`,
      await flash(
        request,
        error(deleteCustomerContactError, "Failed to delete customer contact")
      )
    );
  }

  return redirect(
    `/app/sales/customers/${customerId}`,
    await flash(request, success("Successfully deleted customer contact"))
  );
}
