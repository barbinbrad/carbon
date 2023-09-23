import type { BoxProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

export interface CountProps extends BoxProps {
  count: number;
}

const Count = ({ count, ...props }: CountProps) => {
  const c = count > 99 ? "99+" : count;
  return (
    <Flex
      as="span"
      bg="gray.700"
      borderRadius="full"
      fontSize={12}
      h={5}
      minW={5}
      alignItems="center"
      justifyContent="center"
      color="white"
      {...props}
    >{`${c}`}</Flex>
  );
};

export default Count;
