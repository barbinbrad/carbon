import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  CustomerTypeForm,
  customerTypeValidator,
  upsertCustomerType,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "sales",
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await validator(customerTypeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertCustomerType = await upsertCustomerType(client, {
    ...data,
    createdBy: userId,
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

  return redirect(
    path.to.customerTypes,
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
