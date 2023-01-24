import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { destroyAuthSession } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);

  return destroyAuthSession(request);
}

export async function loader() {
  return redirect("/");
}
