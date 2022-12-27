import { useColor } from "@carbon/react";
import { Box, VStack } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const ContentSidebar = ({ children }: PropsWithChildren<{}>) => (
  <Box
    h="full"
    w="15rem"
    bg={useColor("white")}
    borderRight={1}
    borderRightColor={useColor("gray.300")}
    borderRightStyle="solid"
  >
    <VStack h="full" alignItems="start">
      <Box overflowY="auto" w="full" h="full" pb={8}>
        {children}
      </Box>
    </VStack>
  </Box>
);

export default ContentSidebar;
