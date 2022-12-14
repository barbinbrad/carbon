import type { CSSWithMultiValues, RecursiveCSSObject } from "@chakra-ui/react";

export interface SizeProps<PropType = string | number> {
  sm: PropType;
  md: PropType;
  lg: PropType;
}

export interface SxProps extends CSSWithMultiValues {
  _disabled?: CSSWithMultiValues;
  _focus?: CSSWithMultiValues;
}

export type ThemeObject = RecursiveCSSObject<SxProps>;
