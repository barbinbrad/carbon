import { useRef } from "react";
import { useCalendarState } from "@react-stately/calendar";
import type { CalendarProps } from "@react-aria/calendar";
import { useCalendar } from "@react-aria/calendar";
import type { DateValue } from "@internationalized/date";
import { createCalendar } from "@internationalized/date";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Box, Icon, Heading } from "@chakra-ui/react";
import { CalendarButton } from "./Button";
import { CalendarGrid } from "./CalendarGrid";

const locale = "en-US"; // TODO use user's locale

export const Calendar = (props: CalendarProps<DateValue>) => {
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(props, state);

  return (
    <div {...calendarProps} ref={ref}>
      <Box display="flex" alignItems="center" paddingBottom="4">
        <CalendarButton {...prevButtonProps}>
          <Icon as={BiChevronLeft} w={6} h={6} />
        </CalendarButton>
        <Heading as="h2" size="md" flex="1" textAlign="center">
          {title}
        </Heading>
        <CalendarButton {...nextButtonProps}>
          <Icon as={BiChevronRight} w={6} h={6} />
        </CalendarButton>
      </Box>
      <CalendarGrid state={state} />
    </div>
  );
};
