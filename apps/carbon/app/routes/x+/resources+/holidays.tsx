import { VStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  HolidaysTable,
  HolidaysTableFilters,
} from "~/interfaces/Resources/Holidays";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { getHolidays, getHolidayYears } from "~/services/resources";
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
  const year = searchParams.get("year");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const [holidays, years] = await Promise.all([
    getHolidays(client, {
      name,
      year: year ? parseInt(year) : null,
      limit,
      offset,
      sorts,
    }),
    getHolidayYears(client),
  ]);

  if (holidays.error) {
    return redirect(
      "/x/resources",
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
