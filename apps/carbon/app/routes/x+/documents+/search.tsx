import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  DocumentsTable,
  DocumentsTableFilters,
  getDocumentLabels,
  getDocuments,
} from "~/modules/documents";
import type { Document } from "~/modules/documents";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client, userId } = await requirePermissions(request, {
    view: "documents",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const label = searchParams.get("label");
  const filter = searchParams.get("q");

  const createdBy = filter === "my" ? userId : undefined;
  const favorite = filter === "starred" ? true : undefined;
  const active = filter === "trash" ? false : true;

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [documents, labels] = await Promise.all([
    getDocuments(client, {
      search,
      type,
      label,
      favorite,
      createdBy,
      active,
      limit,
      offset,
      sorts,
      filters,
    }),
    getDocumentLabels(client, userId),
  ]);

  if (documents.error) {
    redirect(
      "/x",
      await flash(request, error(documents.error, "Failed to fetch documents"))
    );
  }

  return json({
    count: documents.count ?? 0,
    documents: (documents.data ?? []) as Document[],
    labels: labels.data ?? [],
  });
}

export default function DocumentsAllRoute() {
  const { count, documents, labels } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <DocumentsTableFilters labels={labels} />
      <DocumentsTable data={documents} count={count} />
      <Outlet />
    </VStack>
  );
}
