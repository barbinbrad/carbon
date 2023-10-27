import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  DepartmentsTable,
  DepartmentsTableFilters,
  getDepartments,
} from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";
import { getGenericQueryFilters } from "~/utils/query";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Departments",
  to: path.to.departments,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset, sorts } = getGenericQueryFilters(searchParams);

  const departments = await getDepartments(client, {
    name,
    limit,
    offset,
    sorts,
  });

  if (departments.error) {
    return redirect(
      path.to.resources,
      await flash(
        request,
        error(departments.error, "Failed to load departments")
      )
    );
  }

  return json({
    departments: departments.data ?? [],
    count: departments.count ?? 0,
  });
}

export default function Route() {
  const { departments, count } = useLoaderData<typeof loader>();

  return (
    <VStack w="full" h="full" spacing={0}>
      <DepartmentsTableFilters />
      <DepartmentsTable data={departments} count={count} />
      <Outlet />
    </VStack>
  );
}
