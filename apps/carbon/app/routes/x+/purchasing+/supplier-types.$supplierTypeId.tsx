import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  getSupplierType,
  SupplierTypeForm,
  supplierTypeValidator,
  upsertSupplierType,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
  });

  const { supplierTypeId } = params;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const supplierType = await getSupplierType(client, supplierTypeId);

  if (supplierType.error) {
    return redirect(
      path.to.supplierTypes,
      await flash(
        request,
        error(supplierType.error, "Failed to get supplier type")
      )
    );
  }
  if (supplierType?.data?.protected) {
    return redirect(
      path.to.supplierTypes,
      await flash(request, error(null, "Cannot edit a protected supplier type"))
    );
  }

  return json({
    supplierType: supplierType.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing",
  });

  const validation = await supplierTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;
  if (!id) throw new Error("id not found");

  const updateSupplierType = await upsertSupplierType(client, {
    id,
    ...data,
    updatedBy: userId,
  });

  if (updateSupplierType.error) {
    return json(
      {},
      await flash(
        request,
        error(updateSupplierType.error, "Failed to update supplier type")
      )
    );
  }

  return redirect(
    path.to.supplierTypes,
    await flash(request, success("Updated supplier type"))
  );
}

export default function EditSupplierTypesRoute() {
  const { supplierType } = useLoaderData<typeof loader>();

  const initialValues = {
    id: supplierType.id ?? undefined,
    name: supplierType.name ?? "",
    color: supplierType.color ?? "#000000",
  };

  return <SupplierTypeForm initialValues={initialValues} />;
}
