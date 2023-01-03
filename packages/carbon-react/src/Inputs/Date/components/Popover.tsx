import { useRef } from "react";
import { Box, useColorModeValue, useOutsideClick } from "@chakra-ui/react";
import { useEscape } from "../../../hooks";

export function Popover(props: any) {
  const ref = useRef();
  const { popoverRef = ref, onClose, children, ...rest } = props;

  useEscape(onClose);
  useOutsideClick({
    ref: popoverRef,
    handler: onClose,
  });

  return (
    <Box
      ref={popoverRef}
      background={useColorModeValue("white", "gray.900")}
      borderRadius="md"
      position="absolute"
      zIndex="10"
      top="100%"
      boxShadow="lg"
      marginTop="1"
      padding="6"
      outline="none"
      {...rest}
    >
      {children}
    </Box>
  );
}
