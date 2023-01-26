import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { SupplierTypeForm } from "~/interfaces/Purchasing/SupplierTypes";
import { requirePermissions } from "~/services/auth";
import {
  supplierTypeValidator,
  getSupplierType,
  upsertSupplierType,
} from "~/services/purchasing";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
  });

  const { supplierTypeId } = params;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const supplierType = await getSupplierType(client, supplierTypeId);

  if (supplierType?.data?.protected) {
    return redirect(
      "/app/purchasing/supplier-types",
      await flash(request, error(null, "Cannot edit a protected supplier type"))
    );
  }

  return json({
    supplierType,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "purchasing",
  });

  const validation = await supplierTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, color } = validation.data;

  const updateSupplierType = await upsertSupplierType(client, {
    id,
    name,
    color: color || null,
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
    "/app/purchasing/supplier-types",
    await flash(request, success("Updated supplier type"))
  );
}

export default function EditSupplierTypesRoute() {
  const { supplierType } = useLoaderData<typeof loader>();

  const initialValues = {
    id: supplierType.data?.id ?? undefined,
    name: supplierType.data?.name ?? "",
    color: supplierType.data?.color ?? "#000000",
  };

  return <SupplierTypeForm initialValues={initialValues} />;
}
