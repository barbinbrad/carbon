import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { forwardRef } from "react";

interface ContainerProps {
  children: ReactNode;
  testID?: string;
  width?: number;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ width, testID, children }, ref) => (
    <Box
      ref={ref}
      data-testid={testID}
      display="inline-block"
      position="relative"
      maxW={width}
      w="full"
    >
      {children}
    </Box>
  )
);

Container.displayName = "Container";
export default Container;
