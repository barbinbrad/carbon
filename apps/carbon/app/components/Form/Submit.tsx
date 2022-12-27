import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { useIsSubmitting } from "remix-validated-form";

export const Submit = ({
  children,
  ...props
}: PropsWithChildren<ButtonProps & { text?: string }>) => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      type="submit"
      size="md"
      colorScheme="brand"
      isLoading={isSubmitting || props.isLoading}
      disabled={isSubmitting || props.disabled}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Submit;
