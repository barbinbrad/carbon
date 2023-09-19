import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireAuthSession } from "~/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthSession(request);
  return redirect("/x");
}

export default function IndexRoute() {
  return (
    <p>
      Oops. You shouldn't see this page. Eventually it will be a landing page.
    </p>
  );
}
