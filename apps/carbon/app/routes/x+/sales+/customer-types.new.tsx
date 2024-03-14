import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  CustomerTypeForm,
  customerTypeValidator,
  upsertCustomerType,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path, requestReferrer } from "~/utils/path";
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

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(customerTypeValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertCustomerType = await upsertCustomerType(client, {
    ...data,
    createdBy: userId,
  });
  if (insertCustomerType.error) {
    return modal
      ? json(insertCustomerType)
      : redirect(
          requestReferrer(request) ?? path.to.customerTypes,
          await flash(
            request,
            error(insertCustomerType.error, "Failed to insert customer type")
          )
        );
  }

  return modal
    ? json(insertCustomerType, { status: 201 })
    : redirect(
        path.to.customerTypes,
        await flash(request, success("Customer type created"))
      );
}

export default function NewCustomerTypesRoute() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  return (
    <CustomerTypeForm
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
