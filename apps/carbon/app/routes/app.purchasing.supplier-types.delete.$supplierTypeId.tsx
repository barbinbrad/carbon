import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { DeleteSupplierTypeModal } from "~/interfaces/Purchasing/SupplierTypes";
import { requirePermissions } from "~/services/auth";
import { deleteSupplierType, getSupplierType } from "~/services/purchasing";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });
  const { supplierTypeId } = params;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const supplierType = await getSupplierType(client, Number(supplierTypeId));
  if (supplierType.error) {
    return redirect(
      "/app/purchasing/supplier-types",
      await flash(
        request,
        error(supplierType.error, "Failed to get supplier type")
      )
    );
  }

  return json(supplierType);
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { supplierTypeId } = params;
  if (!supplierTypeId || Number.isNaN(supplierTypeId)) {
    return redirect(
      "/app/purchasing/supplier-types",
      await flash(request, error(params, "Failed to get an supplier type id"))
    );
  }

  const { error: deleteTypeError } = await deleteSupplierType(
    client,
    Number(supplierTypeId)
  );
  if (deleteTypeError) {
    return redirect(
      "/app/purchasing/supplier-types",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete supplier type")
      )
    );
  }

  return redirect(
    "/app/purchasing/supplier-types",
    await flash(request, success("Successfully deleted supplier type"))
  );
}

export default function DeleteSupplierTypeRoute() {
  const { supplierTypeId } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!supplierTypeId || !data) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/app/purchasing/supplier-types");

  return (
    <DeleteSupplierTypeModal
      supplierTypeId={supplierTypeId}
      data={data}
      onCancel={onCancel}
    />
  );
}
