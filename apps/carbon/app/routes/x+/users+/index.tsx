import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/x/users") {
    return redirect("/x/users/employees");
  }
  return null;
}
