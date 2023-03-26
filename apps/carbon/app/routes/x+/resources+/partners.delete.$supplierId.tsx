import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deletePartner, getPartner } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { supplierId } = params;
  if (!supplierId) throw notFound("supplierId not found");

  const partner = await getPartner(client, supplierId);
  if (partner.error) {
    return redirect(
      "/x/resources/partners",
      await flash(request, error(partner.error, "Failed to get partner"))
    );
  }

  return json({
    partner: partner.data,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "resources",
  });

  const { supplierId } = params;
  if (!supplierId) {
    return redirect(
      "/x/resources/partners",
      await flash(request, error(params, "Failed to get partner id"))
    );
  }

  const { error: deletePartnerError } = await deletePartner(client, supplierId);
  if (deletePartnerError) {
    return redirect(
      "/x/resources/partners",
      await flash(
        request,
        error(deletePartnerError, "Failed to delete partner")
      )
    );
  }

  return redirect(
    "/x/resources/partners",
    await flash(request, success("Successfully deleted partner"))
  );
}

export default function DeletePartnerRoute() {
  const { partner } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const onCancel = () => navigate("/x/resources/partners");

  return (
    <ConfirmDelete
      action={`/x/resources/partners/delete/${partner.supplierLocationId}`}
      name={partner.supplierName ?? ""}
      text={`Are you sure you want to delete the partner: ${
        partner.supplierName ?? ""
      }? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
