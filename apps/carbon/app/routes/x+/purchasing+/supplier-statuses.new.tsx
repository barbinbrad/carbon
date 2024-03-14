import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  SupplierStatusForm,
  supplierStatusValidator,
  upsertSupplierStatus,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path, requestReferrer } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  await requirePermissions(request, {
    create: "purchasing",
  });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
  });

  const formData = await request.formData();
  const modal = formData.get("type") === "modal";

  const validation = await validator(supplierStatusValidator).validate(
    formData
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertSupplierStatus = await upsertSupplierStatus(client, {
    ...data,
    createdBy: userId,
  });
  if (insertSupplierStatus.error) {
    return modal
      ? json(insertSupplierStatus)
      : redirect(
          requestReferrer(request) ?? path.to.supplierStatuses,
          await flash(
            request,
            error(
              insertSupplierStatus.error,
              "Failed to insert supplier status"
            )
          )
        );
  }

  return modal
    ? json(insertSupplierStatus, { status: 201 })
    : redirect(
        path.to.supplierStatuses,
        await flash(request, success("Supplier status created"))
      );
}

export default function NewSupplierStatusesRoute() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  return (
    <SupplierStatusForm
      initialValues={initialValues}
      onClose={() => navigate(-1)}
    />
  );
}
