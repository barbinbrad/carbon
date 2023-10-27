import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  ShiftsTable,
  ShiftsTableFilters,
  getLocations,
  getShifts,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Shifts",
  to: path.to.shifts,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const location = searchParams.get("location");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [shifts, locations] = await Promise.all([
    getShifts(client, { name, location, limit, offset, sorts }),
    getLocations(client),
  ]);

  if (shifts.error) {
    return redirect(
      path.to.resources,
      await flash(request, error(shifts.error, "Failed to load shifts"))
    );
  }

  return json({
    shifts: shifts.data ?? [],
    locations: locations.data ?? [],
    count: shifts.count ?? 0,
  });
}

export default function ShiftsRoute() {
  const { shifts, locations, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <ShiftsTableFilters locations={locations} />
      <ShiftsTable data={shifts} count={count} />
      <Outlet />
    </VStack>
  );
}
