import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteCustomerType, getCustomerType } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });
  const { customerTypeId } = params;
  if (!customerTypeId) throw notFound("customerTypeId not found");

  const customerType = await getCustomerType(client, customerTypeId);
  if (customerType.error) {
    return redirect(
      path.to.customerTypes,
      await flash(
        request,
        error(customerType.error, "Failed to get customer type")
      )
    );
  }

  return json({ customerType: customerType.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "sales",
  });

  const { customerTypeId } = params;
  if (!customerTypeId) {
    return redirect(
      path.to.customerTypes,
      await flash(request, error(params, "Failed to get an customer type id"))
    );
  }

  const { error: deleteTypeError } = await deleteCustomerType(
    client,
    customerTypeId
  );
  if (deleteTypeError) {
    return redirect(
      path.to.customerTypes,
      await flash(
        request,
        error(deleteTypeError, "Failed to delete customer type")
      )
    );
  }

  return redirect(
    path.to.customerTypes,
    await flash(request, success("Successfully deleted customer type"))
  );
}

export default function DeleteCustomerTypeRoute() {
  const { customerTypeId } = useParams();
  const { customerType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!customerTypeId) throw new Error("customerTypeId not found");

  const onCancel = () => navigate(path.to.customerTypes);

  return (
    <ConfirmDelete
      action={path.to.deleteCustomerType(customerTypeId)}
      name={customerType.name}
      text={`Are you sure you want to delete the customer type: ${customerType.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
