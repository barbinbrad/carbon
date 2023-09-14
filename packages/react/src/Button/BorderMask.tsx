import type { BoxProps } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

interface BorderMaskProps extends BoxProps {
  width: string | number;
  radius?: string | number;
}

const BorderMask = ({
  width,
  radius = "inherit",
  children,
  ...otherProps
}: BorderMaskProps) => {
  const widthWithUnit = typeof width === "number" ? width + "px" : width;
  return (
    <Box
      pos="absolute"
      inset={`calc(-1 * ${widthWithUnit})`}
      pointerEvents="none"
      borderWidth={width}
      borderRadius={radius}
      borderColor="transparent"
      style={{
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
      {...otherProps}
    >
      <Box
        pos="absolute"
        inset={`calc(-2 * ${widthWithUnit})`}
        overflow="hidden"
      >
        {children}
      </Box>
    </Box>
  );
};

export default BorderMask;
