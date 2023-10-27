import { useColor } from "@carbon/react";
import { Box, IconButton, Tooltip, VStack } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { BsFillHexagonFill } from "react-icons/bs";
import { z } from "zod";
import { useSidebar } from "./useSidebar";

export const ModuleHandle = z.object({
  module: z.string(),
});

const IconSidebar = () => {
  const links = useSidebar();
  const matchedModules = useMatches().reduce((acc, match) => {
    if (match.handle) {
      const result = ModuleHandle.safeParse(match.handle);
      if (result.success) {
        acc.add(result.data.module);
      }
    }

    return acc;
  }, new Set<string>());

  return (
    <Box
      h="full"
      borderRight={1}
      borderRightColor={useColor("gray.200")}
      borderRightStyle="solid"
      background={useColor("white")}
      zIndex={1}
    >
      <IconButton
        aria-label="Home"
        as={Link}
        to="/"
        variant="ghost"
        size="lg"
        icon={<BsFillHexagonFill />}
        position="sticky"
        top={0}
        mb={4}
      />

      <VStack spacing={0} top={50} position="sticky">
        {links.map((link) => {
          const module = link.to.split("/")[2]; // link.to is "/x/parts" -- this returns "parts"

          const isActive = matchedModules.has(module);
          return (
            <Tooltip key={link.to} label={link.name} placement="right">
              <IconButton
                as={Link}
                to={link.to}
                prefetch="intent"
                colorScheme={isActive ? link.color ?? "brand" : undefined}
                variant={isActive ? "solid" : "outline"}
                size="lg"
                borderRadius={0}
                borderWidth={1}
                borderColor={isActive ? "gray.200" : "transparent"}
                aria-label={link.name}
                icon={link.icon}
              />
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};

export default IconSidebar;
