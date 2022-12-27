import { useColor } from "@carbon/react";
import { Button, Grid, Text, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useMatches } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useUsersSidebar } from "~/modules/Users";

export const meta: MetaFunction = () => ({
  title: "Carbon | Users",
});

export default function UsersRoute() {
  const { links } = useUsersSidebar();
  const matches = useMatches();
  const borderColor = useColor("gray.200");
  const labelColor = useColor("gray.500");

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr" overflow="auto">
      <ContentSidebar>
        <VStack spacing={2}>
          {links.map((groups) =>
            Object.entries(groups).map(([group, routes]) => (
              <VStack
                key={group}
                spacing={1}
                alignItems="start"
                borderBottomStyle={"solid"}
                borderBottomWidth={1}
                borderBottomColor={borderColor}
                px={2}
                py={4}
                w="full"
              >
                <Text color={labelColor} fontSize="sm" pl={3} py={1}>
                  {group}
                </Text>
                {routes.map((route) => {
                  const isActive = matches.some((match) =>
                    match.pathname.includes(route.to)
                  );
                  return (
                    <Button
                      key={route.name}
                      as={Link}
                      to={route.to}
                      variant={isActive ? "solid" : "ghost"}
                      fontWeight={isActive ? "bold" : "normal"}
                      justifyContent="start"
                      w="full"
                    >
                      {route.name}
                    </Button>
                  );
                })}
              </VStack>
            ))
          )}
        </VStack>
      </ContentSidebar>
      <VStack w="full" h="full" spacing={0}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
