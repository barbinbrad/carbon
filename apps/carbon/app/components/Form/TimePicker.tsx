import { TimePicker as CarbonTimePicker } from "@carbon/react";
import type {
  CalendarDateTime,
  Time,
  ZonedDateTime,
} from "@internationalized/date";
import { parseTime } from "@internationalized/date";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { useField } from "remix-validated-form";

type TimePickerProps = {
  name: string;
  label?: string;
  minValue?: TimeValue;
  maxValue?: TimeValue;
  onChange?: (date: TimeValue) => void;
};
type TimeValue = Time | CalendarDateTime | ZonedDateTime;

const TimePicker = ({ name, label, onChange }: TimePickerProps) => {
  const { error, defaultValue, validate } = useField(name);
  const [date, setDate] = useState<TimeValue | null>(
    defaultValue ? parseTime(defaultValue) : null
  );

  const handleChange = (date: TimeValue) => {
    setDate(date);
    validate();
    onChange?.(date);
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} value={date?.toString()} />
      <CarbonTimePicker
        value={date ?? undefined}
        //@ts-ignore
        onChange={handleChange}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default TimePicker;
