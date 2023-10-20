import { Grid } from "@chakra-ui/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import {
  getPurchaseInvoice,
  getPurchaseInvoiceLines,
  PurchaseInvoiceHeader,
  PurchaseInvoiceSidebar,
} from "~/modules/invoicing";
import { getLocationsList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const { invoiceId } = params;
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const [purchaseInvoice, purchaseInvoiceLines, locations] = await Promise.all([
    getPurchaseInvoice(client, invoiceId),
    getPurchaseInvoiceLines(client, invoiceId),
    getLocationsList(client),
  ]);

  if (purchaseInvoice.error) {
    return redirect(
      path.to.purchaseInvoices,
      await flash(
        request,
        error(purchaseInvoice.error, "Failed to load purchase invoice")
      )
    );
  }

  return json({
    purchaseInvoice: purchaseInvoice.data,
    purchaseInvoiceLines: purchaseInvoiceLines.data ?? [],
    locations: locations.data ?? [],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return redirect(request.headers.get("Referer") ?? request.url);
}

export default function PurchaseInvoiceRoute() {
  return (
    <>
      <PurchaseInvoiceHeader />
      <Grid
        gridTemplateColumns={["1fr", "1fr", "1fr 4fr"]}
        gridGap={4}
        w="full"
      >
        <PurchaseInvoiceSidebar />
        <Outlet />
      </Grid>
    </>
  );
}
