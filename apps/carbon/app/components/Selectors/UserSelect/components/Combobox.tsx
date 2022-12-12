import { Box } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import useUserSelectContext from "../provider";

const Combobox = ({ children }: PropsWithChildren) => {
  const { onKeyDown } = useUserSelectContext();
  return <Box onKeyDown={onKeyDown}>{children}</Box>;
};

export default Combobox;
