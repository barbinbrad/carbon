import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { CustomerTypeForm } from "~/interfaces/Sales/CustomerTypes";
import { requirePermissions } from "~/services/auth";
import {
  customerTypeValidator,
  getCustomerType,
  upsertCustomerType,
} from "~/services/sales";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
    role: "employee",
  });

  const { customerTypeId } = params;
  if (!customerTypeId) throw notFound("customerTypeId not found");

  const customerType = await getCustomerType(client, customerTypeId);

  if (customerType?.data?.protected) {
    return redirect(
      "/app/sales/customer-types",
      await flash(request, error(null, "Cannot edit a protected customer type"))
    );
  }

  return json({
    customerType,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "sales",
  });

  const validation = await customerTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, color } = validation.data;

  const updateCustomerType = await upsertCustomerType(client, {
    id,
    name,
    color: color || null,
  });

  if (updateCustomerType.error) {
    return json(
      {},
      await flash(
        request,
        error(updateCustomerType.error, "Failed to update customer type")
      )
    );
  }

  return redirect(
    "/app/sales/customer-types",
    await flash(request, success("Updated customer type"))
  );
}

export default function EditCustomerTypesRoute() {
  const { customerType } = useLoaderData<typeof loader>();

  const initialValues = {
    id: customerType.data?.id ?? undefined,
    name: customerType.data?.name ?? "",
    color: customerType.data?.color ?? "#000000",
  };

  return <CustomerTypeForm initialValues={initialValues} />;
}
