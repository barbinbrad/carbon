import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { useIsSubmitting } from "remix-validated-form";

export const Submit = ({
  formId,
  children,
  ...props
}: PropsWithChildren<ButtonProps & { formId?: string; text?: string }>) => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button
      form={formId}
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
