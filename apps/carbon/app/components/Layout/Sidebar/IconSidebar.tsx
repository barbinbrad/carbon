import { useColor } from "@carbon/react";
import { Box, IconButton, Tooltip, VStack } from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { BsFillHexagonFill } from "react-icons/bs";
import { useSidebar } from "./useSidebar";

const IconSidebar = () => {
  const links = useSidebar();
  const matchedPaths = useMatches().map((match) => match.pathname);

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
        mb={4}
      />

      <VStack spacing={0} top={50} position="sticky">
        {links.map((link) => {
          const isActive = matchedPaths.includes(link.to);
          return (
            <Tooltip key={link.to} label={link.name} placement="right">
              <IconButton
                as={Link}
                to={link.to}
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
