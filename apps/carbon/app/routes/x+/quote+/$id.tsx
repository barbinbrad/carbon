import {
  Heading,
  Menubar,
  MenubarItem,
  VStack,
  useDisclosure,
  useKeyboardShortcuts,
} from "@carbon/react";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@vercel/remix";
import { json, redirect } from "@vercel/remix";
import { useEffect, useRef } from "react";
import { CollapsibleSidebar } from "~/components/Layout";
import { useSupabase } from "~/lib/supabase";
import { getLocationsList } from "~/modules/resources";
import {
  QuotationExplorer,
  QuotationStatus,
  getQuote,
  getQuoteAssemblies,
  getQuoteExternalDocuments,
  getQuoteInternalDocuments,
  getQuoteLines,
  getQuoteMaterials,
  getQuoteOperations,
  useQuotation,
  useQuotationLinePriceEffectsUpdate,
} from "~/modules/sales";
import QuotationReleaseModal from "~/modules/sales/ui/Quotation/QuotationReleaseModal";

import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Quotations",
  to: path.to.quotes,
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  currentParams,
  nextUrl,
}) => {
  // we don't want to revalidate if we're making an update to the quote line quantities
  // because it'll cause an infinite loop
  return !(
    currentUrl.pathname === nextUrl.pathname &&
    "lineId" in currentParams &&
    currentUrl.pathname.includes("details")
  );
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "sales",
  });

  const { id } = params;
  if (!id) throw new Error("Could not find id");

  const [
    quotation,
    quotationLines,
    quotationAssemblies,
    quotationMaterials,
    quotationOperations,
    externalDocuments,
    internalDocuments,
    locations,
  ] = await Promise.all([
    getQuote(client, id),
    getQuoteLines(client, id),
    getQuoteAssemblies(client, id),
    getQuoteMaterials(client, id),
    getQuoteOperations(client, id),
    getQuoteExternalDocuments(client, id),
    getQuoteInternalDocuments(client, id),
    getLocationsList(client),
  ]);

  if (quotation.error) {
    return redirect(
      path.to.quotes,
      await flash(
        request,
        error(quotation.error, "Failed to load quotation summary")
      )
    );
  }

  return json({
    quotation: quotation.data,
    quotationLines: quotationLines.data ?? [],
    quotationAssemblies: quotationAssemblies.data ?? [],
    quotationMaterials: quotationMaterials.data ?? [],
    quotationOperations: quotationOperations.data ?? [],
    externalDocuments: externalDocuments.data ?? [],
    internalDocuments: internalDocuments.data ?? [],
    locations: locations.data ?? [],
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return redirect(request.headers.get("Referer") ?? request.url);
}

export default function QuotationRoute() {
  const { supabase } = useSupabase();
  const {
    quotation,
    quotationLines,
    quotationAssemblies,
    quotationMaterials,
    quotationOperations,
  } = useLoaderData<typeof loader>();
  const releaseDisclosure = useDisclosure();

  const [quote, setQuote] = useQuotation();
  useQuotationLinePriceEffectsUpdate();

  useEffect(() => {
    setQuote({
      client: supabase,
      quote: quotation,
      lines: quotationLines,
      assemblies: quotationAssemblies,
      materials: quotationMaterials,
      operations: quotationOperations,
    });
  }, [
    quotationLines,
    quotationAssemblies,
    quotationMaterials,
    quotationOperations,
    setQuote,
    quotation,
    supabase,
  ]);

  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const buttonRef = useRef<HTMLButtonElement>(null);
  useKeyboardShortcuts({
    l: (event: KeyboardEvent) => {
      event.stopPropagation();
      buttonRef.current?.click();
    },
  });

  return (
    <div className="grid grid-cols-[auto_1fr] w-full">
      <CollapsibleSidebar width={260}>
        <VStack className="border-b border-border p-4" spacing={1}>
          <Heading size="h3" noOfLines={1}>
            {quote.quote?.quoteId}
          </Heading>
          {quote.quote && <QuotationStatus status={quote.quote?.status} />}
        </VStack>
        <QuotationExplorer />
      </CollapsibleSidebar>
      <VStack className="p-2">
        <Menubar>
          <MenubarItem asChild>
            <a target="_blank" href={path.to.file.quote(id)} rel="noreferrer">
              Preview
            </a>
          </MenubarItem>
          <MenubarItem
            onClick={releaseDisclosure.onOpen}
            // isDisabled={isReleased}
          >
            Release
          </MenubarItem>
        </Menubar>
        <Outlet />
      </VStack>
      {releaseDisclosure.isOpen && (
        <QuotationReleaseModal
          quotation={quotation}
          onClose={releaseDisclosure.onClose}
        />
      )}
    </div>
  );
}
