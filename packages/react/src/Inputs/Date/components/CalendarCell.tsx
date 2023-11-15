import { Button, Td } from "@chakra-ui/react";
import type { CalendarDate } from "@internationalized/date";
import { isSameMonth } from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import type {
  CalendarState,
  RangeCalendarState,
} from "@react-stately/calendar";
import { useRef } from "react";

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
  const {
    cellProps,
    buttonProps,
    isSelected,
    isInvalid,
    isDisabled,
    isUnavailable,
    isFocused,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  return (
    <Td {...cellProps} textAlign="center" p={1} border="none">
      <Button
        {...buttonProps}
        ref={ref}
        size="sm"
        colorScheme={isInvalid ? "red" : "brand"}
        variant={isSelected || isFocused ? "solid" : "ghost"}
        w={8}
        h={8}
        p={0}
        rounded="full"
        opacity={
          isOutsideMonth
            ? 0.25
            : isInvalid || isDisabled || isUnavailable
            ? 0.5
            : 1
        }
        _hover={{
          bg: isSelected || isFocused ? undefined : "gray.200",
        }}
      >
        {formattedDate}
      </Button>
    </Td>
  );
};
