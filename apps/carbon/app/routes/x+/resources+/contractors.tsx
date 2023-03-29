import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ContractorsTable,
  ContractorsTableFilters,
  getContractors,
  getAbilitiesList,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const ability = searchParams.get("ability");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [contractors, abilities] = await Promise.all([
    getContractors(client, {
      name,
      limit,
      offset,
      sorts,
      ability,
    }),
    getAbilitiesList(client),
  ]);

  if (contractors.error) {
    return redirect(
      "/x/resources",
      await flash(
        request,
        error(contractors.error, "Failed to load contractors")
      )
    );
  }

  return json({
    contractors: contractors.data ?? [],
    abilities: abilities.data ?? [],
    count: contractors.count ?? 0,
  });
}

export default function Route() {
  const { contractors, abilities, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ContractorsTableFilters abilities={abilities} />
      <ContractorsTable data={contractors} count={count} />
      <Outlet />
    </VStack>
  );
}
