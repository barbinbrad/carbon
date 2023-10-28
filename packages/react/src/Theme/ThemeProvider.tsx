import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { theme as carbonTheme } from "./theme";

export enum Mode {
  Dark = "dark",
  Light = "light",
}

type ThemeProviderProps = {
  brandColor?: string;
  children: ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useMemo(() => {
    return extendTheme({
      ...carbonTheme,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default ThemeProvider;
