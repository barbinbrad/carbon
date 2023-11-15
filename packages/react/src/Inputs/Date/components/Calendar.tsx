import { Box, Heading } from "@chakra-ui/react";
import type { CalendarDate, DateValue } from "@internationalized/date";
import { createCalendar } from "@internationalized/date";
import type { CalendarProps } from "@react-aria/calendar";
import { useCalendar } from "@react-aria/calendar";
import { useCalendarState } from "@react-stately/calendar";
import { useMemo, useRef } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
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
  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  const title = useLocalizedTitle(
    state.visibleRange.start,
    state.visibleRange.end,
    state.timeZone,
    "en-US"
  );

  return (
    <div {...calendarProps} ref={ref}>
      <Box display="flex" alignItems="center" paddingBottom="4">
        <CalendarButton
          {...prevButtonProps}
          icon={<BiChevronLeft />}
          aria-label="Previous"
        />

        <Heading as="h2" size="md" flex="1" textAlign="center">
          {title}
        </Heading>
        <CalendarButton
          {...nextButtonProps}
          icon={<BiChevronRight />}
          aria-label="Next"
        />
      </Box>
      <CalendarGrid state={state} />
    </div>
  );
};

function useLocalizedTitle(
  startDate: CalendarDate,
  endDate: CalendarDate,
  timeZone: string,
  locale: string
) {
  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    });
  }, [locale]);

  return dateFormatter.format(startDate.toDate(timeZone));
}
