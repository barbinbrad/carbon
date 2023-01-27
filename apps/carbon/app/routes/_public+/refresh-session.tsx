import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import { refreshAuthSession, commitAuthSession } from "~/services/session";
import { assertIsPost } from "~/utils/http";

// this is just for supabase provider refresh
export async function action({ request }: ActionArgs) {
  assertIsPost(request);

  const authSession = await refreshAuthSession(request);

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await commitAuthSession(request, {
          authSession,
        }),
      },
    }
  );
}

export function ErrorBoundary() {
  const navigate = useNavigate();
  navigate("/x");
  return null;
}
