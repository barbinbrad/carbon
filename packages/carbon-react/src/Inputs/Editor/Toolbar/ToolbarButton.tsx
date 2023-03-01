import type { IconButtonProps } from "@chakra-ui/react";
import { IconButton, Tooltip } from "@chakra-ui/react";
import * as React from "react";

interface ToolbarButtonProps extends Omit<IconButtonProps, "aria-label"> {
  label: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, ...rest }) => {
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
