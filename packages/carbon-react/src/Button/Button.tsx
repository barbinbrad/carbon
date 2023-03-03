import * as React from "react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { Box, Button as ChakraButton } from "@chakra-ui/react";
import BorderMask from "./BorderMask";
import BorderFollower from "./BorderFollower";
import { AnimatePresence, motion } from "framer-motion";

const MotionBox = motion(Box);

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 0.3,
  },
};

interface ButtonProps extends ChakraButtonProps {}

const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  return (
    <ChakraButton
      {...props}
      isDisabled={isLoading || props.isDisabled}
      borderColor="gray.600"
      borderStyle="solid"
      borderWidth={2}
    >
      <BorderMask width={2}>
        <AnimatePresence>
          {isLoading && (
            <BorderFollower duration={1400} radius="1rem">
              <MotionBox
                w={20}
                h={20}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            </BorderFollower>
          )}
        </AnimatePresence>
      </BorderMask>
      {children}
    </ChakraButton>
  );
};

export default Button;
