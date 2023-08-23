import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAccountsList } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {});

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("type");
  const incomeBalance = searchParams.get("incomeBalance");

  return json(
    await getAccountsList(authorized.client, {
      type,
      incomeBalance,
    })
  );
}
