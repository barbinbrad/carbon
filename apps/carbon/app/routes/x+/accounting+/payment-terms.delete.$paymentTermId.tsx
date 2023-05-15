import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deletePaymentTerm, getPaymentTerm } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";
import { notFound } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });
  const { paymentTermId } = params;
  if (!paymentTermId) throw notFound("paymentTermId not found");

  const paymentTerm = await getPaymentTerm(client, paymentTermId);
  if (paymentTerm.error) {
    return redirect(
      "/x/accounting/payment-terms",
      await flash(
        request,
        error(paymentTerm.error, "Failed to get payment term")
      )
    );
  }

  return json({ paymentTerm: paymentTerm.data });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "accounting",
  });

  const { paymentTermId } = params;
  if (!paymentTermId) {
    return redirect(
      "/x/accounting/payment-terms",
      await flash(request, error(params, "Failed to get an payment term id"))
    );
  }

  const { error: deleteTypeError } = await deletePaymentTerm(
    client,
    paymentTermId
  );
  if (deleteTypeError) {
    return redirect(
      "/x/accounting/payment-terms",
      await flash(
        request,
        error(deleteTypeError, "Failed to delete payment term")
      )
    );
  }

  return redirect(
    "/x/accounting/payment-terms",
    await flash(request, success("Successfully deleted payment term"))
  );
}

export default function DeletePaymentTermRoute() {
  const { paymentTermId } = useParams();
  const { paymentTerm } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!paymentTermId || !paymentTerm) return null; // TODO - handle this better (404?)

  const onCancel = () => navigate("/x/accounting/payment-terms");

  return (
    <ConfirmDelete
      action={`/x/accounting/payment-terms/delete/${paymentTermId}`}
      name={paymentTerm.name}
      text={`Are you sure you want to delete the payment term: ${paymentTerm.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
