import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { CustomerTypeForm } from "~/interfaces/Sales/CustomerTypes";
import { requirePermissions } from "~/services/auth";
import { customerTypeValidator, upsertCustomerType } from "~/services/sales";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  await requirePermissions(request, {
    create: "sales",
  });

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await customerTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, color } = validation.data;

  const insertCustomerType = await upsertCustomerType(client, {
    name,
    color: color || null,
  });
  if (insertCustomerType.error) {
    return json(
      {},
      await flash(
        request,
        error(insertCustomerType.error, "Failed to insert customer type")
      )
    );
  }

  const customerTypeId = insertCustomerType.data[0]?.id;
  if (!customerTypeId) {
    return json(
      {},
      await flash(
        request,
        error(insertCustomerType, "Failed to insert customer type")
      )
    );
  }

  return redirect(
    "/x/sales/customer-types",
    await flash(request, success("Customer type created"))
  );
}

export default function NewCustomerTypesRoute() {
  const initialValues = {
    name: "",
    color: "#000000",
  };

  return <CustomerTypeForm initialValues={initialValues} />;
}
