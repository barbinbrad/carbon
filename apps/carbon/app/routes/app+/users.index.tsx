import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/app/users") {
    return redirect("/app/users/employees");
  }
  return null;
}
