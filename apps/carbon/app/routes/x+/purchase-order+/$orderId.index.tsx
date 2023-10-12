import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");
  return redirect(`/x/purchase-order/${orderId}/details`);
}
