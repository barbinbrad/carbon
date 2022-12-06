import { colors } from "./palette";

/* Examples:
 * Focus ring color: https://codesandbox.io/s/chakra-change-focus-ring-color-c2yis?file=/src/theme.ts
 */

export const theme = {
  colors,
  components: {
    Button: {
      baseStyle: {},
      // styles for different sizes ("sm", "md", "lg")
      sizes: {},
      // styles for different visual variants ("outline", "solid")
      variants: {
        solid: (props: { colorScheme: string }) => {
          const { colorScheme: c } = props;
          if (c !== "brand") return {};

          return {
            bg: `black`,
            color: "white",
            _hover: {
              bg: "gray.900",
              color: "white",
            },
            _active: {
              bg: "gray.800",
              color: "white",
            },
          };
        },
      },
      defaultProps: {
        size: "sm",
        borderRadius: "md",
      },
    },
    Input: {
      defaultProps: {
        borderRadius: "md",
      },
    },
    Select: {
      defaultProps: {
        borderRadius: "md",
      },
    },
    Checkbox: {
      baseStyle: {},
      defaultProps: {},
    },
  },
  defaultProps: {
    colorScheme: "gray",
  },
};
