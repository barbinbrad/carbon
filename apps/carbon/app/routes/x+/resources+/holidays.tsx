import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  getHolidays,
  getHolidayYears,
  HolidaysTable,
  HolidaysTableFilters,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const year = searchParams.get("year");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [holidays, years] = await Promise.all([
    getHolidays(client, {
      name,
      year: year ? parseInt(year) : new Date().getFullYear(),
      limit,
      offset,
      sorts,
    }),
    getHolidayYears(client),
  ]);

  if (holidays.error) {
    return redirect(
      path.to.resources,
      await flash(request, error(holidays.error, "Failed to load holidays"))
    );
  }

  return json({
    holidays: holidays.data ?? [],
    years:
      years?.data?.map((d) => d.year as number).sort((a, b) => b - a) ?? [],
    count: holidays.count ?? 0,
  });
}

export default function Route() {
  const { holidays, years, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <HolidaysTableFilters years={years} />
      <HolidaysTable data={holidays} count={count} />
      <Outlet />
    </VStack>
  );
}
