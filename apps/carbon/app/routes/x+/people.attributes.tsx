import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "people",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [categories, dataTypes] = await Promise.all([
    getAttributeCategories(client, { name, limit, offset, sorts }),
    getAttributeDataTypes(client),
  ]);

  if (categories.error) {
    redirect(
      "/x",
      await flash(
        request,
        error(categories.error, "Failed to fetch attribute categories")
      )
    );
  }

  return json({
    count: categories.count ?? 0,
    categories: categories.data ?? [],
    dataTypes: dataTypes.data ?? [],
  });
}

export default function UserAttributesRoute() {
  const { count, categories } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <AttributeCategoriesTableFilters />
      <AttributeCategoriesTable data={categories} count={count} />
      <Outlet />
    </VStack>
  );
}
