import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import type { ComponentProps } from "react";
import { forwardRef } from "react";
import { RxDotFilled } from "react-icons/rx";

const Status = forwardRef<
  HTMLDivElement,
  ComponentProps<"div"> & {
    color?: "green" | "orange" | "red" | "yellow" | "blue" | "gray";
  }
>(({ color = "gray", children, className, ...props }, ref) => {
  return (
    <Tag colorScheme={color} className={className} ref={ref}>
      <TagLeftIcon as={RxDotFilled} marginEnd={0} size="10px" />
      <TagLabel>{children}</TagLabel>
    </Tag>
  );
});

Status.displayName = "Status";

export default Status;
