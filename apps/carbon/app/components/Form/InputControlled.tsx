import type { InputProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { forwardRef, useEffect } from "react";
import { useControlField, useField } from "remix-validated-form";

type FormInputControlledProps = Omit<InputProps, "value" | "onChange"> & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange?: (newValue: string) => void;
};

const InputControlled = forwardRef<HTMLInputElement, FormInputControlledProps>(
  (
    {
      name,
      label,
      isRequired,
      helperText,
      prefix,
      suffix,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const { getInputProps, error } = useField(name);
    const [controlValue, setControlValue] = useControlField<string>(name);

    useEffect(() => {
      console.log(`setting controlled value to ${value}`);
      setControlValue(value);
    }, [setControlValue, value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setControlValue(e.target.value);
      if (onChange && typeof onChange === "function") {
        onChange(e.target.value);
      }
    };

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputGroup>
          {prefix && <InputLeftAddon children={prefix} />}
          <ChakraInput
            ref={ref}
            {...getInputProps({
              id: name,
              ...rest,
              // @ts-ignore
              value: controlValue,
            })}
            onChange={handleChange}
            value={controlValue}
          />
          {suffix && <InputRightAddon children={suffix} />}
        </InputGroup>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

InputControlled.displayName = "InputControlled";

export default InputControlled;
