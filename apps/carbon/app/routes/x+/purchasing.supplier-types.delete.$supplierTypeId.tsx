import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { requirePermissions } from "~/services/auth";
import { deleteSupplierType, getSupplierType } from "~/services/purchasing";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
  });
  const { supplierTypeId } = params;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const supplierType = await getSupplierType(client, supplierTypeId);
  if (supplierType.error) {
    return redirect(
      "/x/purchasing/supplier-types",
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
  if (!supplierTypeId) {
    return redirect(
      "/x/purchasing/supplier-types",
      await flash(request, error(params, "Failed to get an supplier type id"))
    );
  }

  const { error: deleteTypeError } = await deleteSupplierType(
    client,
    supplierTypeId
  );
  if (deleteTypeError) {
    return redirect(
      "/x/purchasing/supplier-types",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete supplier type")
      )
    );
  }

  return redirect(
    "/x/purchasing/supplier-types",
    await flash(request, success("Successfully deleted supplier type"))
  );
}

export default function DeleteSupplierTypeRoute() {
  const { supplierTypeId } = useParams();
  const { data } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!supplierTypeId || !data) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/purchasing/supplier-types");
  return (
    <ConfirmDelete
      action={`/x/purchasing/supplier-types/delete/${supplierTypeId}`}
      name={data.name}
      text={`Are you sure you want to delete the supplier type: ${data.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
