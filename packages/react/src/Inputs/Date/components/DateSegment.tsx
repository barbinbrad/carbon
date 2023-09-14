import { Box } from "@chakra-ui/react";
import { useDateSegment } from "@react-aria/datepicker";
import type {
  DateSegment as DateSegmentType,
  useDateFieldState,
} from "@react-stately/datepicker";
import { useId, useRef } from "react";
import { useColor } from "../../../hooks";

export const DateSegment = ({
  segment,
  state,
}: {
  segment: DateSegmentType;
  state: ReturnType<typeof useDateFieldState>;
}) => {
  const instanceId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  if ("id" in segmentProps && segmentProps.id) {
    segmentProps.id = instanceId;
  }
  if ("aria-describedby" in segmentProps && segmentProps["aria-describedby"]) {
    segmentProps["aria-describedby"] = instanceId;
  }

  const lighter = useColor("gray.500");
  const light = useColor("gray.600");
  const black = useColor("black");

  return (
    <Box
      {...segmentProps}
      id={instanceId}
      ref={ref}
      style={{
        ...segmentProps.style,
        fontVariantNumeric: "tabular-nums",
        boxSizing: "content-box",
      }}
      minWidth={
        segment.maxValue !== undefined
          ? String(segment.maxValue).length + "ch"
          : undefined
      }
      paddingX="0.5"
      textAlign="end"
      outline="none"
      rounded="md"
      color={
        segment.isPlaceholder ? lighter : !segment.isEditable ? light : black
      }
      _focus={{
        background: "gray.500",
        color: "white",
      }}
    >
      {segment.text}
    </Box>
  );
};
