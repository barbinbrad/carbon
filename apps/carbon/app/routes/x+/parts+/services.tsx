import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ServicesTable,
  ServicesTableFilters,
  getPartGroupsList,
  getServices,
} from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Services",
  to: path.to.services,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "parts",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const group = searchParams.get("group");
  const supplierId = searchParams.get("supplierId");

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [services, partGroups] = await Promise.all([
    getServices(client, {
      search,
      type,
      group,
      supplierId,
      limit,
      offset,
      sorts,
      filters,
    }),
    getPartGroupsList(client),
  ]);

  if (services.error) {
    redirect(
      path.to.parts,
      await flash(request, error(services.error, "Failed to fetch services"))
    );
  }

  return json({
    count: services.count ?? 0,
    services: services.data ?? [],
    partGroups: partGroups.data ?? [],
  });
}

export default function ServicesSearchRoute() {
  const { count, services, partGroups } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ServicesTableFilters partGroups={partGroups} />
      <ServicesTable data={services} count={count} />
      <Outlet />
    </VStack>
  );
}
