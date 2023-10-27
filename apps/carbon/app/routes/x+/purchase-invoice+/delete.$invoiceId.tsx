import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deletePurchaseInvoice } from "~/modules/invoicing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost, notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    delete: "invoicing",
  });

  const { invoiceId } = params;
  if (!invoiceId) throw notFound("invoiceId not found");

  const remove = await deletePurchaseInvoice(client, invoiceId);

  if (remove.error) {
    return redirect(
      path.to.purchaseInvoices,
      await flash(
        request,
        error(remove.error, "Failed to delete purchase invoice")
      )
    );
  }

  return redirect(path.to.purchaseInvoices);
}
