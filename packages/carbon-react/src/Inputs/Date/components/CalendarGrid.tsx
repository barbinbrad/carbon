import { useCalendarGrid } from "@react-aria/calendar";
import { getWeeksInMonth, endOfMonth } from "@internationalized/date";
import type { DateDuration } from "@internationalized/date";
import { CalendarCell } from "./CalendarCell";
import type {
  CalendarState,
  RangeCalendarState,
} from "@react-stately/calendar";

const locale = "en-US"; // TODO use user's locale

export const CalendarGrid = ({
  state,
  offset = {},
}: {
  state: CalendarState | RangeCalendarState;
  offset?: DateDuration;
}) => {
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
    },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
