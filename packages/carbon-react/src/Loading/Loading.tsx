import { Center, Spinner, useColorMode } from "@chakra-ui/react";

type LoadingProps = {
  size?: "sm" | "md" | "lg" | "xl";
};

export default function Loading({ size = "lg" }: LoadingProps) {
  const { colorMode } = useColorMode();
  const emptyColor = colorMode !== "dark" ? "gray.200" : "whiteAlpha.300";

  return (
    <Center h="full" w="full">
      <Spinner
        thickness="4px"
        speed="1s"
        emptyColor={emptyColor}
        color="brand.500"
        size={size}
      />
    </Center>
  );
}
