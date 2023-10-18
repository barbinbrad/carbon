import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");
  return redirect(`/x/purchase-order/${invoiceId}/details`);
}
