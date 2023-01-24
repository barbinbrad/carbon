import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  AttributeCategoriesTable,
  AttributeCategoriesTableFilters,
} from "~/interfaces/People/Attributes";
import { requirePermissions } from "~/services/auth";
import {
  getAttributeCategories,
  getAttributeDataTypes,
} from "~/services/people";
import { getGenericQueryFilters } from "~/utils/query";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "people",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [categories, dataTypes] = await Promise.all([
    getAttributeCategories(client, { name, limit, offset, sorts }),
    getAttributeDataTypes(client),
  ]);

  return json({
    categories,
    dataTypes,
  });
}

export default function UserAttributesRoute() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <AttributeCategoriesTableFilters />
      <AttributeCategoriesTable
        data={categories.data ?? []}
        count={categories.count ?? 0}
      />
      <Outlet />
    </VStack>
  );
}
