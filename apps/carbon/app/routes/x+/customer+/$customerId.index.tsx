import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type { CustomerDetail } from "~/modules/sales";
import {
  CustomerForm,
  customerValidator,
  updateCustomer,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await customerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  if (!id) {
    return redirect(
      path.to.customers,
      await flash(request, error(null, "Failed to update customer"))
    );
  }

  const update = await updateCustomer(client, {
    id,
    ...data,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.customers,
      await flash(request, error(update.error, "Failed to update customer"))
    );
  }

  return json(null, await flash(request, success("Updated customer")));
}

export default function CustomerEditRoute() {
  const { customerId } = useParams();
  if (!customerId) throw new Error("Could not find customerId");
  const routeData = useRouteData<{ customer: CustomerDetail }>(
    path.to.customer(customerId)
  );

  if (!routeData?.customer) return null;

  const initialValues = {
    id: routeData?.customer?.id ?? undefined,
    name: routeData?.customer?.name ?? "",
    customerTypeId: routeData?.customer?.customerTypeId ?? undefined,
    customerStatusId: routeData?.customer?.customerStatusId ?? undefined,
    accountManagerId: routeData?.customer?.accountManagerId ?? undefined,
    taxId: routeData?.customer?.taxId ?? "",
  };

  return <CustomerForm initialValues={initialValues} />;
}
