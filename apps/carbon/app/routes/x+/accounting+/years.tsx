import { useColor } from "@carbon/react";
import { VStack } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { PageTitle } from "~/components/Layout";
import {
  FiscalYearSettingsForm,
  fiscalYearSettingsValidator,
  getFiscalYearSettings,
  updateFiscalYearSettings,
} from "~/modules/accounting";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Fiscal Years",
  to: path.to.fiscalYears,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "accounting",
  });

  const settings = await getFiscalYearSettings(client);
  if (settings.error) {
    return redirect(
      path.to.accounting,
      await flash(
        request,
        error(settings.error, "Failed to get fiscal year settings")
      )
    );
  }

  return json({ settings: settings.data });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "accounting",
  });

  const validation = await fiscalYearSettingsValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }
  const { startMonth, taxStartMonth } = validation.data;

  const update = await updateFiscalYearSettings(client, {
    startMonth,
    // @ts-expect-error
    taxStartMonth: taxStartMonth === "same" ? startMonth : taxStartMonth,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.fiscalYears,
      await flash(
        request,
        error(update.error, "Failed to update fiscal year settings")
      )
    );
  }

  return redirect(
    path.to.fiscalYears,
    await flash(request, success("Successfully updated fiscal year settings"))
  );
}

export default function FiscalYearSettingsRoute() {
  const { settings } = useLoaderData<typeof loader>();

  const initialValues = {
    startMonth: settings?.startMonth || "January",
    taxStartMonth:
      settings?.startMonth === settings.taxStartMonth
        ? "same"
        : settings?.taxStartMonth || "January",
  };

  return (
    <VStack w="full" h="full" spacing={0} p={8} bg={useColor("white")}>
      <PageTitle
        title="Fiscal Year Settings"
        subtitle="Define the month when your fiscal year starts"
      />
      <FiscalYearSettingsForm
        // @ts-expect-error
        initialValues={initialValues}
      />
    </VStack>
  );
}
