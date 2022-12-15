import { useColor } from "@carbon/react";
import { Box, Button, HStack } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions } from "~/hooks";
import { EmployeeTypesTable } from "~/modules/Users/EmployeeTypes";
import { requirePermissions } from "~/services/auth";
import { getEmployeeTypes } from "~/services/users";
import { getPaginationParams } from "~/utils/http";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset } = getPaginationParams(searchParams);

  return json(await getEmployeeTypes(client, { name, limit, offset }));
}

export default function EmployeeTypesRoute() {
  const { data, count } = useLoaderData<typeof loader>();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");

  return (
    <>
      <Box>
        <HStack
          px={4}
          py={3}
          justifyContent="space-between"
          borderBottomColor={borderColor}
          borderBottomStyle="solid"
          borderBottomWidth={1}
        >
          <HStack spacing={2}>
            <DebouncedInput
              param="name"
              size="sm"
              minW={180}
              placeholder="Search by name"
            />
          </HStack>
          <HStack spacing={2}>
            {permissions.can("create", "users") && (
              <Button
                as={Link}
                to="new"
                colorScheme="brand"
                leftIcon={<IoMdAdd />}
              >
                New Employee Type
              </Button>
            )}
          </HStack>
        </HStack>
        <EmployeeTypesTable data={data ?? []} count={count ?? 0} />
      </Box>
      <Outlet />
    </>
  );
}
