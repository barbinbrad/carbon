import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import * as React from "react";

type ToolbarButtonProps = Omit<IconButtonProps, "aria-label"> & {
  label: string;
};

const ToolbarButton = ({ label, ...rest }: ToolbarButtonProps) => {
  return (
    <Tooltip label={label}>
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="gray"
        aria-label={label}
        {...rest}
      />
    </Tooltip>
  );
};

export default ToolbarButton;
