import { Box } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";

export interface CountProps extends BoxProps {
  count: number;
}

const Count = ({ count, ...props }: CountProps) => {
  const c = count > 99 ? "99+" : count;
  return (
    <Box
      as="span"
      bg="gray.700"
      borderRadius="full"
      fontSize="sm"
      py={1}
      px={2}
      color="white"
    >{`${c}`}</Box>
  );
};

export default Count;
