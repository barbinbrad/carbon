import { useRef } from "react";
import { useLocale } from "@react-aria/i18n";
import { useTimeFieldState } from "@react-stately/datepicker";
import type { TimeFieldStateOptions } from "@react-stately/datepicker";
import { useTimeField } from "@react-aria/datepicker";
import { Box } from "@chakra-ui/react";
import { DateSegment } from "./components/DateSegment";
import { StyledField } from "./components/StyledField";

const TimePicker = (
  props: Omit<TimeFieldStateOptions, "locale" | "createCalendar">
) => {
  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { fieldProps } = useTimeField(props, state, ref);

  return (
    <Box mt={2}>
      <StyledField {...fieldProps} ref={ref} pr={2}>
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </StyledField>
    </Box>
  );
};

export default TimePicker;
