import { useRef } from "react";
import { useDateFieldState } from "@react-stately/datepicker";
import type { AriaDateFieldProps } from "@react-aria/datepicker";
import { useDateField } from "@react-aria/datepicker";
import { createCalendar } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { Box } from "@chakra-ui/react";
import { DateSegment } from "./DateSegment";

const locale = "en-US"; // TODO use user's locale;

const DateField = (props: AriaDateFieldProps<DateValue>) => {
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <Box {...fieldProps} ref={ref} display="flex">
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </Box>
  );
};

export default DateField;
