import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getFiscalYearSettings } from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const [fiscalYearSettings] = await Promise.all([
    getFiscalYearSettings(client),
  ]);

  if (fiscalYearSettings.error || fiscalYearSettings.data === null) {
    return redirect(
      "/x/accounting",
      await flash(
        request,
        error(fiscalYearSettings.error, "Failed to fetch fiscal year settings")
      )
    );
  }

  return json({
    fiscalYearSettings: fiscalYearSettings.data,
  });
}

export async function action({ request }: ActionFunctionArgs) {}

export default function FiscalYearsRoute() {
  const { fiscalYearSettings } = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(fiscalYearSettings, null, 2)}</pre>;
}
