import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  AbilitiesTable,
  AbilitiesTableFilters,
} from "~/interfaces/Resources/Abilities";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getAbilities } from "~/services/resources";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const abilities = await getAbilities(client, { name, limit, offset, sorts });

  if (abilities.error) {
    return redirect(
      "/x/resources",
      await flash(request, error(abilities.error, "Failed to load abilities"))
    );
  }

  return json({
    abilities: abilities.data ?? [],
    count: abilities.count ?? 0,
  });
}

export default function AbilitiesRoute() {
  const { abilities, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <AbilitiesTableFilters />
      <AbilitiesTable data={abilities} count={count} />
      <Outlet />
    </VStack>
  );
}
