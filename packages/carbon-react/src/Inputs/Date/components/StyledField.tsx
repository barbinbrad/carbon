import { Box, useColorModeValue } from "@chakra-ui/react";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

export type StyledFieldProps = HTMLAttributes<HTMLElement> & {
  pr: number | string;
};

export const StyledField = forwardRef<HTMLDivElement, StyledFieldProps>(
  function Field({ children, ...otherProps }, ref) {
    return (
      <Box
        position="relative"
        border="1px solid"
        borderColor={useColorModeValue("gray.300", "gray.600")}
        rounded="md"
        transition="all 200ms"
        display="flex"
        alignItems="center"
        px="1"
        py=".4rem"
        _hover={{
          borderColor: "gray.400",
        }}
        _focusWithin={{
          borderColor: "gray.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
        }}
        {...otherProps}
        ref={ref}
      >
        {children}
      </Box>
    );
  }
);
