import { Box } from "@chakra-ui/react";
import { useDateSegment } from "@react-aria/datepicker";
import type {
  DateSegment as DateSegmentType,
  useDateFieldState,
} from "@react-stately/datepicker";
import { useRef } from "react";
import { useColor } from "../../../hooks";

export const DateSegment = ({
  segment,
  state,
}: {
  segment: DateSegmentType;
  state: ReturnType<typeof useDateFieldState>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  const lighter = useColor("gray.500");
  const light = useColor("gray.600");
  const black = useColor("black");

  return (
    <Box
      {...segmentProps}
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
