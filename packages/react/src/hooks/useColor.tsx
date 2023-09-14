import { useColorModeValue } from "@chakra-ui/react";

const darkModeColor = {
  white: "black",
  black: "white",
  "gray.50": "whiteAlpha.100",
  "gray.100": "gray.900",
  "gray.200": "gray.800",
  "gray.300": "gray.700",
  "gray.400": "whiteAlpha.400",
  "gray.500": "gray.500",
  "gray.600": "gray.400",
  "gray.700": "gray.300",
  "gray.800": "gray.200",
  "gray.900": "gray.100",
  "var(--chakra-colors-gray-50)": "var(--chakra-colors-whiteAlpha-100)",
  "var(--chakra-colors-gray-100)": "var(--chakra-colors-gray-900)",
  "var(--chakra-colors-gray-200)": "var(--chakra-colors-gray-800)",
  "var(--chakra-colors-gray-300)": "var(--chakra-colors-gray-700)",
  "var(--chakra-colors-gray-400)": "var(--chakra-colors-gray-600)",
  "var(--chakra-colors-gray-500)": "var(--chakra-colors-gray-500)",
  "var(--chakra-colors-gray-600)": "var(--chakra-colors-gray-400)",
  "var(--chakra-colors-gray-700)": "var(--chakra-colors-gray-300)",
  "var(--chakra-colors-gray-800)": "var(--chakra-colors-gray-200)",
  "var(--chakra-colors-gray-900)": "var(--chakra-colors-gray-100)",
};

export default function useColor(color: keyof typeof darkModeColor) {
  return useColorModeValue(color, darkModeColor[color]);
}
