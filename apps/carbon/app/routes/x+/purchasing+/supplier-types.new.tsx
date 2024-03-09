import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  SupplierTypeForm,
  supplierTypeValidator,
  upsertSupplierType,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
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

  const validation = await validator(supplierTypeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const insertSupplierType = await upsertSupplierType(client, {
    ...data,
    createdBy: userId,
  });
  if (insertSupplierType.error) {
    return json(
      {},
      await flash(
        request,
        error(insertSupplierType.error, "Failed to insert supplier type")
      )
    );
  }

  return redirect(
    path.to.supplierTypes,
    await flash(request, success("Supplier type created"))
  );
}

export default function NewSupplierTypesRoute() {
  const initialValues = {
    name: "",
    color: "#000000",
  };

  return <SupplierTypeForm initialValues={initialValues} />;
}
