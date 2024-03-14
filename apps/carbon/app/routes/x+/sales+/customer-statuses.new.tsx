import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  CustomerStatusForm,
  customerStatusValidator,
  upsertCustomerStatus,
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

  const validation = await validator(customerStatusValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertCustomerStatus = await upsertCustomerStatus(client, {
    ...data,
    createdBy: userId,
  });
  if (insertCustomerStatus.error) {
    return modal
      ? json(insertCustomerStatus)
      : redirect(
          requestReferrer(request) ?? path.to.customerStatuses,
          await flash(
            request,
            error(
              insertCustomerStatus.error,
              "Failed to insert customer status"
            )
          )
        );
  }

  return modal
    ? json(insertCustomerStatus, { status: 201 })
    : redirect(
        path.to.customerStatuses,
        await flash(request, success("Customer status created"))
      );
}

export default function NewCustomerStatusesRoute() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  return (
    <CustomerStatusForm
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
