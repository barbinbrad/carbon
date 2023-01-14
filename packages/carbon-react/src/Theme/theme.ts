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
    Checkbox: {
      defaultProps: {
        colorScheme: "blackAlpha",
      },
    },
    Input: {
      defaultProps: {
        borderRadius: "md",
      },
      variants: {
        outline: focusRingOutlined,
        filled: focusRingFilled,
        flushed: focusRingFlushed,
      },
    },
    ModalOverlay: {
      defaultProps: {
        backdropFilter: "blur(10px) hue-rotate(90deg)",
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
    TextArea: {
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
