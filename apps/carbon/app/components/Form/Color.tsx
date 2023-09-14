import { useColor } from "@carbon/react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";

import { useRef } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useControlField, useField } from "remix-validated-form";

type ColorFieldProps = {
  name: string;
  label: string;
};

const ColorPicker = ({ name, label }: ColorFieldProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  const disclosure = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => disclosure.onClose(),
  });

  const borderColor = useColor("var(--chakra-colors-gray-200)");

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <input type="hidden" name={name} value={value} />
      <Box position="relative" ref={containerRef}>
        <HStack>
          <Box
            as={Button}
            bg={value}
            h={8}
            w={8}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="md"
            cursor="pointer"
            onClick={disclosure.onToggle}
            tabIndex={0}
            _hover={{
              bg: value,
            }}
          />
          <HexColorInput
            color={value}
            onChange={setValue}
            style={{
              padding: "0 0.5rem",
              height: "2.25rem",
              borderRadius: "0.275rem",
              outline: "2px solid transparent",
              outlineOffset: "2px",
              border: `1px solid ${borderColor}`,
            }}
          />
        </HStack>
        <Box
          position="absolute"
          marginTop={1}
          top={10}
          zIndex={3}
          hidden={!disclosure.isOpen}
        >
          <HexColorPicker color={value} onChange={setValue} />
        </Box>
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default ColorPicker;
