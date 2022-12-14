import { useColor } from "@carbon/react";
import type { SystemStyleObject } from "@chakra-ui/react";
import { useMultiStyleConfig } from "@chakra-ui/react";
import type { ThemeObject } from "~/types/chakra";

export const useGroupStyles = (isFocused: boolean, isSticky: boolean) => {
  const menuItemStyles = useMultiStyleConfig("Menu").item as ThemeObject;
  const selectedBg = useColor("gray.200");
  const selectedColor = useColor("black");

  const sx: SystemStyleObject = {
    ...menuItemStyles,
    transition: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    textAlign: "start",
    padding: "8px 12px",
    marginBottom: "3px",
    bg: "transparent",
    borderRadius: "md",

    ...(isFocused && menuItemStyles._focus),
    ...(isFocused && {
      bg: selectedBg,
      color: selectedColor,
      _active: { bg: selectedBg },
    }),
    _hover: {
      bg: selectedBg,
      color: selectedColor,
      ...menuItemStyles._focus,
    },
    _focus: {
      boxShadow: "none",
      outlineWeight: "3px",
    },
  };

  return sx;
};

export const useOptionStyles = (
  isFocused: boolean,
  isSelected?: boolean,
  isDisabled?: boolean
) => {
  const menuItemStyles = useMultiStyleConfig("Menu").item as ThemeObject;
  const selectedBg = useColor("gray.700");
  const selectedColor = useColor("white");

  const sx: SystemStyleObject = {
    ...menuItemStyles,
    fontSize: "0.9em",
    transition: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    width: "100%",
    textAlign: "start",
    padding: "8px 12px",
    marginBottom: "3px",
    bg: "transparent",
    borderRadius: "md",
    outlineOffset: "3px",
    ...(isFocused && menuItemStyles._focus),
    ...(isSelected && {
      // bg: selectedBg,
      // color: selectedColor,
      // _active: { bg: selectedBg },
      ...menuItemStyles._focus,
    }),
    ...(isFocused && { bg: selectedBg, color: selectedColor }),
    ...(isDisabled && menuItemStyles._disabled),
    ...(isDisabled && { _active: {} }),
    _hover: {
      bg: selectedBg,
      color: selectedColor,
    },
    _focus: {
      boxShadow: "none",
      outline: "none",
    },
  };

  return sx;
};
