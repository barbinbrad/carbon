import type { SliderProps as ChakraSliderProps } from "@chakra-ui/react";
import {
  Box,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { FormHelperText } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Slider as ChakraSlider,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { useField } from "remix-validated-form";

type SliderProps = ChakraSliderProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
};

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ name, label, isRequired, helperText, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <ChakraSlider
          {...getInputProps({
            id: name,
            ...rest,
          })}
        >
          <SliderTrack bg="green.100" h={2}>
            <Box position="relative" right={10} />
            <SliderFilledTrack bg="green.500" />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </ChakraSlider>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
