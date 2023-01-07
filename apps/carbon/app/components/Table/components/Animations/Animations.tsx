import {
  Td as ChakraTd,
  Th as ChakraTh,
  Tr as ChakraTr,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export const spring = {
  type: "spring",
  damping: 10,
  stiffness: 30,
};

export const Th = motion(ChakraTh);
export const Tr = motion(ChakraTr);
export const Td = motion(ChakraTd);
