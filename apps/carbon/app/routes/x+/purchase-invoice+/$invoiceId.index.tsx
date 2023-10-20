import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";

export async function loader({ params }: LoaderFunctionArgs) {
  const { invoiceId } = params;
  if (!invoiceId) throw notFound("Could not find invoiceId");
  return redirect(path.to.purchaseInvoiceDetails(invoiceId));
}
