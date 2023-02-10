import {
  focusRingFilled,
  focusRingFlushed,
  focusRingOutlined,
} from "./focusRing";
import { colors } from "./palette";

export const theme = {
  colors,
  styles: {
    global: {
      ":host,:root": {
        "--chakra-ui-focus-ring-color": "#002aff99",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {},
      sizes: {},
      variants: {
        solid: (props: { colorScheme: string }) => {
          const { colorScheme: c } = props;

          if (c !== "brand")
            return {
              borderColor: "gray.200",
              borderWidth: "1px",
              borderStyle: "solid",
            };

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
    Card: {
      baseStyle: {
        header: {
          borderColor: "gray.200",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
        },
        footer: {
          background: "gray.100",
          display: "block",
        },
      },
    },
    Checkbox: {
      defaultProps: {
        colorScheme: "blackAlpha",
      },
    },
    Drawer: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(3px)",
        },
        footer: {
          borderColor: "gray.200",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
        },
      },
      defaultProps: {},
    },
    Input: {
      baseStyle: {
        field: {
          background: "white",
        },
      },
      defaultProps: {
        borderRadius: "md",
      },
      variants: {
        outline: focusRingOutlined,
        filled: focusRingFilled,
        flushed: focusRingFlushed,
      },
    },
    Modal: {
      baseStyle: {
        overlay: {
          backdropFilter: "blur(3px)",
        },
      },
    },
    Radio: {
      defaultProps: {
        colorScheme: "blackAlpha",
      },
    },
    Select: {
      defaultProps: {
        borderRadius: "md",
      },
      variants: {
        outline: focusRingOutlined,
        filled: focusRingFilled,
        flushed: focusRingFlushed,
      },
    },
    Switch: {
      defaultProps: {
        colorScheme: "green",
      },
    },
    Textarea: {
      variants: {
        outline: () => focusRingOutlined().field,
        filled: () => focusRingFilled().field,
        flushed: () => focusRingFlushed().field,
      },
    },
  },
  shadows: {
    outline: "0 0 0 3px var(--chakra-ui-focus-ring-color)",
  },
  defaultProps: {
    colorScheme: "gray",
  },
};
