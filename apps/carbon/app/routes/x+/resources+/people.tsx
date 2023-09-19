import { VStack } from "@chakra-ui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { usePermissions } from "~/hooks";
import {
  getAttributeCategories,
  getPeople,
  PeopleTable,
  PeopleTableFilters,
} from "~/modules/resources";
import { getEmployeeTypes } from "~/modules/users";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
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
  const type = searchParams.get("type");
  const active = searchParams.get("active") !== "false";

  const { limit, offset, sorts, filters } =
    getGenericQueryFilters(searchParams);

  const [attributeCategories, employeeTypes, people] = await Promise.all([
    getAttributeCategories(client),
    getEmployeeTypes(client),
    getPeople(client, { name, type, active, limit, offset, sorts, filters }),
  ]);
  if (attributeCategories.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(attributeCategories.error, "Error loading attribute categories")
      )
    );
  }
  if (employeeTypes.error) {
    return redirect(
      "/x",
      await flash(
        request,
        error(employeeTypes.error, "Error loading employee types")
      )
    );
  }
  if (people.error) {
    return redirect(
      "/x",
      await flash(request, error(people.error, "Error loading people"))
    );
  }

  return json({
    attributeCategories: attributeCategories.data,
    employeeTypes: employeeTypes.data,
    people: people.data,
    count: people.count,
  });
}

export default function ResourcesPeopleRoute() {
  const { attributeCategories, count, employeeTypes, people } =
    useLoaderData<typeof loader>();
  const permissions = usePermissions();

  return (
    <VStack w="full" h="full" spacing={0}>
      <PeopleTableFilters employeeTypes={employeeTypes ?? []} />
      <PeopleTable
        attributeCategories={attributeCategories}
        data={people ?? []}
        count={count ?? 0}
        isEditable={permissions.can("update", "resources")}
      />
      <Outlet />
    </VStack>
  );
}
