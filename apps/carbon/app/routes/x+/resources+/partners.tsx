import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  PartnersTable,
  PartnersTableFilters,
  getAbilitiesList,
  getPartners,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Partners",
  to: path.to.partners,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const ability = searchParams.get("ability");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [partners, abilities] = await Promise.all([
    getPartners(client, {
      name,
      limit,
      offset,
      sorts,
      ability,
    }),
    getAbilitiesList(client),
  ]);

  if (partners.error) {
    return redirect(
      path.to.resources,
      await flash(request, error(partners.error, "Failed to load partners"))
    );
  }

  return json({
    partners: partners.data ?? [],
    abilities: abilities.data ?? [],
    count: partners.count ?? 0,
  });
}

export default function Route() {
  const { partners, abilities, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PartnersTableFilters abilities={abilities} />
      <PartnersTable data={partners} count={count} />
      <Outlet />
    </VStack>
  );
}
