import {
  focusRingFilled,
  focusRingFlushed,
  focusRingOutlined,
} from "./focusRing";
import { fonts } from "./fonts";
import { colors } from "./palette";
import { semanticTokens } from "./tokens";

export const theme = {
  fonts,
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
      baseStyle: {
        transition: "transform 0.08s ease-out, background 0.3s, opacity 0.3s",
        _active: { transform: "scale(0.96)" },
        _disabled: {
          pointerEvents: "none",
          opacity: 0.5,
        },
      },
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
          letterSpacing: "tight",
        },
        footer: {
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderColor: "gray.200",
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
        header: {
          borderColor: "gray.200",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          marginBottom: 4,
          letterSpacing: "tight",
        },
        footer: {
          borderColor: "gray.200",
          borderTopWidth: "1px",
          borderTopStyle: "solid",
        },
      },
      defaultProps: {},
    },
    Heading: {
      baseStyle: {
        letterSpacing: "tight",
      },
    },
    Input: {
      defaultProps: {
        borderRadius: "md",
      },
      sizes: {
        sm: {
          field: {
            borderRadius: "md",
          },
        },
      },
      variants: {
        outline: focusRingOutlined,
        filled: focusRingFilled,
        flushed: focusRingFlushed,
      },
    },
    Modal: {
      baseStyle: {
        header: {
          letterSpacing: "tight",
        },
        overlay: {
          backdropFilter: "blur(3px)",
        },
      },
    },
    NumberInput: {
      variants: {
        outline: focusRingOutlined,
        filled: focusRingFilled,
        flushed: focusRingFlushed,
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
    Tabs: {
      variants: {
        line: {
          tab: {
            _selected: {
              color: "black",
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: () => focusRingOutlined,
        filled: () => focusRingFilled,
        flushed: () => focusRingFlushed,
      },
    },
  },
  shadows: {
    outline: "0 0 0 3px var(--chakra-ui-focus-ring-color)",
  },
  defaultProps: {
    colorScheme: "gray",
  },
  semanticTokens,
};
