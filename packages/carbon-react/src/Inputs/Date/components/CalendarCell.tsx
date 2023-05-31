import { useRef } from "react";
import { useCalendarCell } from "@react-aria/calendar";
import type { CalendarDate } from "@internationalized/date";
import { isSameMonth } from "@internationalized/date";
import { Button, Box } from "@chakra-ui/react";
import type {
  CalendarState,
  RangeCalendarState,
} from "@react-stately/calendar";

export const CalendarCell = ({
  state,
  date,
  currentMonth,
}: {
  state: CalendarState | RangeCalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { cellProps, buttonProps, isSelected, isInvalid, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  return (
    <Box as="td" {...cellProps} textAlign="center">
      <Button
        {...buttonProps}
        ref={ref}
        hidden={isOutsideMonth}
        size="sm"
        colorScheme={isInvalid ? "red" : "brand"}
        variant={isSelected ? "solid" : "ghost"}
        width="100%"
      >
        {formattedDate}
      </Button>
    </Box>
  );
};
