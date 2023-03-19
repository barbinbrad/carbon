import { useColor } from "@carbon/react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { Route } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const ContentSidebar = ({ links }: { links: Route[] }) => {
  const matches = useMatches();
  const borderColor = useColor("gray.200");

  return (
    <CollapsibleSidebar>
      <VStack h="full" alignItems="start">
        <Box overflowY="auto" w="full" h="full" pb={8}>
          <VStack spacing={2}>
            <VStack
              spacing={1}
              alignItems="start"
              borderBottomStyle={"solid"}
              borderBottomWidth={1}
              borderBottomColor={borderColor}
              p={2}
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
        </Box>
      </VStack>
    </CollapsibleSidebar>
  );
};

export default ContentSidebar;
