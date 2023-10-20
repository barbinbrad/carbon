import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteShippingMethod, getShippingMethod } from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "inventory",
  });
  const { shippingMethodId } = params;
  if (!shippingMethodId) throw notFound("shippingMethodId not found");

  const shippingMethod = await getShippingMethod(client, shippingMethodId);
  if (shippingMethod.error) {
    return redirect(
      path.to.shippingMethods,
      await flash(
        request,
        error(shippingMethod.error, "Failed to get shipping method")
      )
    );
  }

  return json({ shippingMethod: shippingMethod.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "inventory",
  });

  const { shippingMethodId } = params;
  if (!shippingMethodId) {
    return redirect(
      path.to.shippingMethods,
      await flash(request, error(params, "Failed to get an shipping method id"))
    );
  }

  const { error: deleteTypeError } = await deleteShippingMethod(
    client,
    shippingMethodId
  );
  if (deleteTypeError) {
    return redirect(
      path.to.shippingMethods,
      await flash(
        request,
        error(deleteTypeError, "Failed to delete shipping method")
      )
    );
  }

  return redirect(
    path.to.shippingMethods,
    await flash(request, success("Successfully deleted shipping method"))
  );
}

export default function DeleteShippingMethodRoute() {
  const { shippingMethodId } = useParams();
  const { shippingMethod } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!shippingMethodId || !shippingMethod) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate(path.to.shippingMethods);

  return (
    <ConfirmDelete
      action={`/x/inventory/shipping-methods/delete/${shippingMethodId}`}
      name={shippingMethod.name}
      text={`Are you sure you want to delete the shipping method: ${shippingMethod.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
