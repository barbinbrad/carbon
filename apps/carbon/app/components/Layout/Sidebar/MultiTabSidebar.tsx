import { useColor } from "@carbon/react";
import {
  Box,
  IconButton,
  Tooltip,
  VStack,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { ReactElement } from "react";
import { useRef, useState } from "react";

const MotionBox = motion(Box);

type MultiTabSidebarNode = {
  id: string;
  icon: ReactElement;
  label: string;
  component: ReactElement | null;
};

type MultiTabSidebarProps = {
  canCollapse?: boolean;
  defaultIsOpen?: boolean;
  hideOnClickOutside?: boolean;
  nodes: MultiTabSidebarNode[];
};

const variants = {
  visible: {
    position: "asbolute",
    x: "0%",
    z: "0px",
    left: "48px",
  },
  hidden: {
    position: "relative",
    x: "-100%",
    z: "0px",
    left: "0",
  },
  transition: { duration: 0.5 },
};

const MultiTabSidebar = ({
  nodes,
  canCollapse = true,
  defaultIsOpen = false,
  hideOnClickOutside = false,
}: MultiTabSidebarProps) => {
  const [activeNode, setActiveNode] = useState<string | null>(
    defaultIsOpen || !canCollapse ? nodes?.[0].id ?? null : null
  );

  const sidebar = useDisclosure({
    defaultIsOpen,
  });

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (hideOnClickOutside) sidebar.onClose();
    },
  });

  const initialState = defaultIsOpen
    ? {
        position: "relative",
        x: "0%",
        left: "48px",
      }
    : {
        position: "fixed",
        x: "-100%",
        left: "-100%",
      };

  const getActiveNode = () => {
    if (activeNode === null) return null;
    const node = nodes.find((n) => n.id === activeNode);
    return node?.component;
  };

  const onIconClick = (id: string) => {
    if (activeNode === id && canCollapse) {
      setActiveNode(null);
      sidebar.onClose();
    } else {
      setActiveNode(id);
      if (!sidebar.isOpen) sidebar.onOpen();
    }
  };

  return (
    <>
      <MotionBox
        animate={!sidebar.isOpen ? "hidden" : "visible"}
        initial={initialState}
        variants={variants}
        ref={ref}
        h="full"
        w="20rem"
        bg={useColor("white")}
        borderRight={1}
        borderRightColor={useColor("gray.300")}
        borderRightStyle="solid"
      >
        <VStack h="full" alignItems="start">
          <Box pb={8} overflowY="auto" w="full" h="full" p={2}>
            {/* TODO: persist state between changes */}
            {getActiveNode()}
          </Box>
        </VStack>
      </MotionBox>

      <Box
        position="absolute"
        h="full"
        bg={useColor("white")}
        borderRight={1}
        borderRightColor={useColor("gray.200")}
        borderRightStyle="solid"
      >
        <VStack spacing={0}>
          {nodes.map((node) => (
            <Tooltip key={node.id} label={node.label} placement="right">
              <IconButton
                onClick={() => onIconClick(node.id)}
                variant={node.id === activeNode ? "solid" : "outline"}
                colorScheme="gray"
                size="lg"
                borderRadius={0}
                border="none"
                aria-label={node.label}
                icon={node.icon}
              />
            </Tooltip>
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default MultiTabSidebar;
