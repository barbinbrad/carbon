import type { IconButtonProps } from "@chakra-ui/react";
import { Button, IconButton } from "@chakra-ui/react";
import { useButton } from "@react-aria/button";
import type { AriaButtonProps } from "@react-types/button";
import { useRef } from "react";

export const CalendarButton = (props: AriaButtonProps & IconButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  return (
    <IconButton
      {...buttonProps}
      ref={ref}
      size="sm"
      rounded="full"
      variant="solid"
      {...props}
    />
  );
};

export interface FieldButtonProps extends AriaButtonProps {
  isPressed: boolean;
}

export const FieldButton = (props: FieldButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <Button
      {...buttonProps}
      ref={ref}
      size="sm"
      h="1.75rem"
      mr="2"
      variant="solid"
    >
      {props.children}
    </Button>
  );
};
