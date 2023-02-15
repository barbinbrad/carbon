type ColorMode = "light" | "dark";
export const focusRingOutlined = ({ colorMode }: { colorMode: ColorMode }) => ({
  field: {
    backgroundColor: colorMode == "light" ? "white" : "gray.800",
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 2px var(--chakra-ui-focus-ring-color)",
    },
  },
});

export const focusRingFilled = ({ colorMode }: { colorMode: ColorMode }) => ({
  field: {
    backgroundColor: colorMode == "light" ? "white" : "gray.800",
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 0 0 1px var(--chakra-ui-focus-ring-color)",
    },
  },
});

export const focusRingFlushed = ({ colorMode }: { colorMode: ColorMode }) => ({
  field: {
    backgroundColor: colorMode == "light" ? "white" : "gray.800",
    _focus: {
      borderColor: "var(--chakra-ui-focus-ring-color)",
      boxShadow: "0 1px 0 0 var(--chakra-ui-focus-ring-color)",
    },
  },
});
