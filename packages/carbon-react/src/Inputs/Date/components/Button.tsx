import { useRef } from "react";
import { useButton } from "@react-aria/button";
import { Button } from "@chakra-ui/react";
import type { AriaButtonProps } from "@react-types/button";

export const CalendarButton = (props: AriaButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  return (
    <Button {...buttonProps} ref={ref} size="sm" variant="solid">
      {props.children}
    </Button>
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
