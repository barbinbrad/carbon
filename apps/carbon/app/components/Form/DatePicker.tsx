import { DatePicker as CarbonDatePicker } from "@carbon/react";
import type { CalendarDate } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { useField } from "remix-validated-form";

type DatePickerProps = { name: string; label?: string };

const DatePicker = ({ name, label }: DatePickerProps) => {
  const { error, defaultValue, validate } = useField(name);
  const [date, setDate] = useState<CalendarDate | undefined>(
    defaultValue ? parseDate(defaultValue) : undefined
  );

  const onChange = (date: CalendarDate) => {
    setDate(date);
    validate();
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} value={date?.toString()} />
      <CarbonDatePicker
        value={date}
        //@ts-ignore
        onChange={onChange}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default DatePicker;
