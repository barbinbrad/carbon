import { useColor } from "@carbon/react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { Route } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const GroupedContentSidebar = ({
  links,
}: {
  links: Record<string, Route[]>[];
}) => {
  const matches = useMatches();
  const borderColor = useColor("gray.200");
  const labelColor = useColor("gray.500");

  return (
    <CollapsibleSidebar>
      <VStack h="full" alignItems="start">
        <Box overflowY="auto" w="full" h="full" pb={8}>
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
                        borderColor={isActive ? borderColor : "transparent"}
                        borderStyle="solid"
                        borderWidth={1}
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
        </Box>
      </VStack>
    </CollapsibleSidebar>
  );
};

export default GroupedContentSidebar;
