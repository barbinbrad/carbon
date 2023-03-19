import { useColor } from "@carbon/react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import type { RouteGroup } from "~/types";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const GroupedContentSidebar = ({ groups }: { groups: RouteGroup[] }) => {
  const matches = useMatches();
  const borderColor = useColor("gray.200");
  const labelColor = useColor("gray.400");

  return (
    <CollapsibleSidebar>
      <VStack h="full" alignItems="start">
        <Box overflowY="auto" w="full" h="full" pb={8}>
          <VStack spacing={2}>
            {groups.map((group) => (
              <VStack
                key={group.name}
                spacing={1}
                alignItems="start"
                borderBottomStyle={"solid"}
                borderBottomWidth={1}
                borderBottomColor={borderColor}
                p={2}
                w="full"
              >
                <Text
                  color={labelColor}
                  fontSize="xs"
                  fontWeight="bold"
                  pl={3}
                  py={1}
                  textTransform="uppercase"
                >
                  {group.name}
                </Text>
                {group.routes.map((route) => {
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
                      leftIcon={route.icon}
                      justifyContent="start"
                      w="full"
                    >
                      {route.name}
                    </Button>
                  );
                })}
              </VStack>
            ))}
          </VStack>
        </Box>
      </VStack>
    </CollapsibleSidebar>
  );
};

export default GroupedContentSidebar;
