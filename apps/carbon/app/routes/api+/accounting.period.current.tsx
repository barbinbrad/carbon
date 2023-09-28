import { getLocalTimeZone, today } from "@internationalized/date";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const date = today(getLocalTimeZone()).toString();

  const accountingPeriod = await client.functions.invoke(
    "get-accounting-period"
  );

  return json({
    period: "xyz",
  });
}
