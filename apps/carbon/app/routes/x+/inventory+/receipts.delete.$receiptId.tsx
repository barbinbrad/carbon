import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteShippingMethod, getShippingMethod } from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
  });
  const { shippingMethodId } = params;
  if (!shippingMethodId) throw notFound("shippingMethodId not found");

  const shippingMethod = await getShippingMethod(client, shippingMethodId);
  if (shippingMethod.error) {
    return redirect(
      "/x/inventory/shipping-methods",
      await flash(
        request,
        error(shippingMethod.error, "Failed to get shipping method")
      )
    );
  }

  return json({ shippingMethod: shippingMethod.data });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "inventory",
  });

  const { shippingMethodId } = params;
  if (!shippingMethodId) {
    return redirect(
      "/x/inventory/shipping-methods",
      await flash(request, error(params, "Failed to get an shipping method id"))
    );
  }

  const { error: deleteTypeError } = await deleteShippingMethod(
    client,
    shippingMethodId
  );
  if (deleteTypeError) {
    return redirect(
      "/x/inventory/shipping-methods",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete shipping method")
      )
    );
  }

  return redirect(
    "/x/inventory/shipping-methods",
    await flash(request, success("Successfully deleted shipping method"))
  );
}

export default function DeleteShippingMethodRoute() {
  const { shippingMethodId } = useParams();
  const { shippingMethod } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!shippingMethodId || !shippingMethod) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/inventory/shipping-methods");

  return (
    <ConfirmDelete
      action={`/x/inventory/shipping-methods/delete/${shippingMethodId}`}
      name={shippingMethod.name}
      text={`Are you sure you want to delete the shipping method: ${shippingMethod.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
