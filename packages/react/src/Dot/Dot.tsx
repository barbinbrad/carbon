import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

type DotProps = BoxProps & {
  color: string;
  size?: number;
  title?: string;
};

const Dot = ({ color, size = 3, title, ...props }: DotProps) => {
  return (
    <Box
      as="span"
      title={title}
      display="inline-block"
      bg={color}
      borderRadius="full"
      w={size}
      h={size}
      ml={size / 2}
      {...props}
    />
  );
};

export default Dot;
