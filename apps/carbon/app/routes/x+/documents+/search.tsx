import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  DocumentsTable,
  DocumentsTableFilters,
  getDocuments,
} from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "documents",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const documents = await getDocuments(client, {
    search,
    limit,
    offset,
    sorts,
    filters,
  });

  if (documents.error) {
    redirect(
      "/x",
      await flash(request, error(documents.error, "Failed to fetch documents"))
    );
  }

  return json({
    count: documents.count ?? 0,
    documents: documents.data ?? [],
  });
}

export default function DocumentsSearchRoute() {
  const { count, documents } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <DocumentsTableFilters />
      <DocumentsTable data={documents} count={count} />
      <Outlet />
    </VStack>
  );
}
