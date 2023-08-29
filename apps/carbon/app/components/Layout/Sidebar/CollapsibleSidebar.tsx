import { useColor } from "@carbon/react";
import { Box, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

const MotionBox = motion(Box);
const variants = {
  visible: {
    width: 180,
  },
  hidden: {
    width: 15,
  },
  transition: { duration: 0.5 },
};

export const CollapsibleSidebar = ({ children }: PropsWithChildren<{}>) => {
  const sidebar = useDisclosure({
    defaultIsOpen: true,
  });

  return (
    <MotionBox
      animate={sidebar.isOpen ? "visible" : "hidden"}
      initial={variants.visible}
      variants={variants}
      bg={useColor("white")}
      borderRight={1}
      borderRightColor={useColor("gray.300")}
      borderRightStyle="solid"
      h="calc(100vh - 50px)"
      position="sticky"
      top={50}
    >
      <Tooltip label={sidebar.isOpen ? "Collapse" : "Expand"} placement="right">
        <IconButton
          onClick={sidebar.onToggle}
          icon={sidebar.isOpen ? <TbArrowBarLeft /> : <TbArrowBarRight />}
          aria-label="Toggle sidebar"
          display="inline-block"
          borderWidth="1px 1px 1px 0px"
          borderStyle="solid"
          borderColor={useColor("gray.200")}
          position="absolute"
          pl={2}
          top="calc(100vh - 135px)"
          color={useColor("gray.700")}
          right="-32px"
          left="auto"
          backgroundColor={useColor("white")}
          borderRadius="0px 4px 4px 0px"
          zIndex={3}
          _hover={{
            backgroundColor: useColor("white"),
          }}
        />
      </Tooltip>
      {sidebar.isOpen ? children : null}
    </MotionBox>
  );
};
