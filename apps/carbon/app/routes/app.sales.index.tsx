import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/app/sales/customers");
}
