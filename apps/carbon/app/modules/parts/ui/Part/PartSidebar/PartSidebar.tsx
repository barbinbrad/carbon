import { useColor } from "@carbon/react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Link, useMatches, useParams } from "@remix-run/react";
import { useRouteData } from "~/hooks";
import type { PartSummary } from "~/modules/parts/types";
import { path } from "~/utils/path";
import { usePartSidebar } from "./usePartSidebar";

const PartSidebar = () => {
  const { partId } = useParams();
  const borderColor = useColor("gray.200");
  if (!partId) throw new Error("partId not found");

  const routeData = useRouteData<{ partSummary: PartSummary }>(
    path.to.part(partId)
  );
  if (!routeData?.partSummary?.replenishmentSystem)
    throw new Error("Could not find replenishmentSystem in routeData");

  const links = usePartSidebar(routeData.partSummary.replenishmentSystem);
  const matches = useMatches();

  return (
    <VStack h="full" alignItems="start">
      <Box overflowY="auto" w="full" h="full">
        <VStack spacing={2}>
          <VStack spacing={1} alignItems="start" w="full">
            {links.map((route) => {
              const isActive = matches.some(
                (match) =>
                  (match.pathname.includes(route.to) && route.to !== "") ||
                  (match.id.includes(".index") && route.to === "")
              );

              return (
                <Button
                  key={route.name}
                  as={Link}
                  to={route.to}
                  variant={isActive ? "solid" : "ghost"}
                  border={isActive ? "1px solid" : "none"}
                  borderColor={borderColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  justifyContent="start"
                  size="md"
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
  );
};

export default PartSidebar;
