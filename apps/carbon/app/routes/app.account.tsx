import { useColor } from "@carbon/react";
import { Button, Grid, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useMatches } from "@remix-run/react";
import { ContentSidebar } from "~/components/Layout/Sidebar";
import { useAccountSidebar } from "~/interfaces/Account";

export const meta: MetaFunction = () => ({
  title: "Carbon | My Account",
});

export default function AccountRoute() {
  const { links } = useAccountSidebar();
  const matches = useMatches();
  const borderColor = useColor("gray.200");

  return (
    <Grid w="full" h="full" templateColumns="auto 1fr">
      <ContentSidebar>
        <VStack spacing={2}>
          <VStack
            spacing={1}
            alignItems="start"
            borderBottomStyle={"solid"}
            borderBottomWidth={1}
            borderBottomColor={borderColor}
            px={2}
            py={4}
            w="full"
          >
            {links.map((route) => {
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
        </VStack>
      </ContentSidebar>
      <VStack w="full" h="full" spacing={0} p={8}>
        <Outlet />
      </VStack>
    </Grid>
  );
}
