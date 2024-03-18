import type { LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { requireAuthSession } from "~/services/session.server";
import { path } from "~/utils/path";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthSession(request);
  return redirect(path.to.authenticatedRoot);
}

export default function IndexRoute() {
  return (
    <p>
      Oops. You shouldn't see this page. Eventually it will be a landing page.
    </p>
  );
}
