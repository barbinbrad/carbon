import { useRef } from "react";
import { useDateRangePickerState } from "@react-stately/datepicker";
import { useDateRangePicker } from "@react-aria/datepicker";
import { InputGroup, Box, Icon, InputRightElement } from "@chakra-ui/react";
import type { DateRangePickerProps, DateValue } from "@react-types/datepicker";
import { MdDoNotDisturbAlt, MdCalendarToday } from "react-icons/md";
import { FieldButton } from "./components/Button";
import { RangeCalendar } from "./components/RangeCalendar";
import { Popover } from "./components/Popover";
import { StyledField } from "./components/StyledField";
import DateField from "./components/DateField";
import TimeField from "./TimePicker";

const DateRangePicker = (props: DateRangePickerProps<DateValue>) => {
  const state = useDateRangePickerState({
    ...props,
    shouldCloseOnSelect: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref);

  return (
    <Box position="relative" display="inline-flex" flexDirection="column">
      <InputGroup {...groupProps} ref={ref} width="auto" display="inline-flex">
        <StyledField pr="5.5rem">
          <DateField {...startFieldProps} />
          <Box as="span" aria-hidden="true" paddingX="2">
            –
          </Box>
          <DateField {...endFieldProps} />
          {state.validationState === "invalid" && (
            <Icon
              as={MdDoNotDisturbAlt}
              color="red.600"
              position="absolute"
              right="12"
            />
          )}
        </StyledField>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <Icon as={MdCalendarToday} />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover
          {...dialogProps}
          isOpen={state.isOpen}
          onClose={() => state.setOpen(false)}
        >
          <RangeCalendar {...calendarProps} />
          <Box display="flex" gap="2">
            <TimeField
              label="Start time"
              value={state.timeRange?.start || null}
              onChange={(v) => state.setTime("start", v)}
            />
            <TimeField
              label="End time"
              value={state.timeRange?.end || null}
              onChange={(v) => state.setTime("end", v)}
            />
          </Box>
        </Popover>
      )}
    </Box>
  );
};

export default DateRangePicker;
