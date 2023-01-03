import { useRef } from "react";
import { useDatePickerState } from "@react-stately/datepicker";
import { useDatePicker } from "@react-aria/datepicker";
import { MdOutlineCalendarToday, MdOutlineDoNotDisturb } from "react-icons/md";
import { Box, Icon, InputGroup, InputRightElement } from "@chakra-ui/react";
import type { DatePickerProps } from "@react-types/datepicker";
import type { CalendarDate } from "@internationalized/date";

import { FieldButton } from "./components/Button";
import { Calendar } from "./components/Calendar";
import { Popover } from "./components/Popover";
import { StyledField } from "./components/StyledField";
import DateField from "./components/DateField";

const DatePicker = (props: DatePickerProps<CalendarDate>) => {
  const state = useDatePickerState({
    ...props,
    shouldCloseOnSelect: false,
  });
  const ref = useRef<HTMLDivElement>(null);
  const { groupProps, fieldProps, buttonProps, dialogProps, calendarProps } =
    useDatePicker(props, state, ref);

  return (
    <Box position="relative" display="inline-flex" flexDirection="column">
      <InputGroup {...groupProps} ref={ref} width="auto" display="inline-flex">
        <StyledField pr="4.5rem">
          <DateField {...fieldProps} />
          {state.validationState === "invalid" && (
            <Icon
              as={MdOutlineDoNotDisturb}
              color="red.600"
              position="absolute"
              right="12"
            />
          )}
        </StyledField>
        <InputRightElement>
          <FieldButton {...buttonProps} isPressed={state.isOpen}>
            <Icon as={MdOutlineCalendarToday} />
          </FieldButton>
        </InputRightElement>
      </InputGroup>
      {state.isOpen && (
        <Popover {...dialogProps} onClose={() => state.setOpen(false)}>
          <Calendar {...calendarProps} />
        </Popover>
      )}
    </Box>
  );
};

export default DatePicker;
