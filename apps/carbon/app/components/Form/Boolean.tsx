import type { SwitchProps, SystemStyleObject } from "@chakra-ui/react";
import { VisuallyHidden } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  chakra,
  omitThemingProps,
  useCheckbox,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import { forwardRef, useMemo } from "react";
import { useControlField, useField } from "remix-validated-form";

type FormBooleanProps = SwitchProps & {
  name: string;
  label?: string;
  description?: string;
};

const Boolean = forwardRef<HTMLInputElement, FormBooleanProps>(
  ({ name, label, description, ...props }, ref) => {
    const { getInputProps, error } = useField(name);
    const [value, setValue] = useControlField<boolean>(name);

    const styles = useMultiStyleConfig("Switch", {
      colorScheme: "green",
      ...props,
    });
    const { ...ownProps } = omitThemingProps(props);

    const { getCheckboxProps, getRootProps, getLabelProps } = useCheckbox({
      ...ownProps,
      isChecked: value,
    });

    const containerStyles: SystemStyleObject = useMemo(
      () => ({
        display: "inline-block",
        position: "relative",
        verticalAlign: "middle",
        lineHeight: 0,
        ...styles.container,
      }),
      [styles.container]
    );

    const trackStyles: SystemStyleObject = useMemo(
      () => ({
        display: "inline-flex",
        flexShrink: 0,
        justifyContent: "flex-start",
        boxSizing: "content-box",
        cursor: "pointer",
        ...styles.track,
      }),
      [styles.track]
    );

    return (
      <FormControl isInvalid={!!error} pt={2}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <HStack w="full">
          <chakra.label
            {...getRootProps()}
            className="chakra-switch"
            __css={containerStyles}
          >
            <VisuallyHidden>
              <input
                ref={ref}
                type="checkbox"
                {...getInputProps({
                  type: "checkbox",
                  id: name,
                })}
                onChange={(e) => setValue(e.target.checked)}
              />
            </VisuallyHidden>
            <HStack>
              <chakra.span
                {...getCheckboxProps()}
                className="chakra-switch__track"
                __css={trackStyles}
              >
                <chakra.span
                  __css={styles.thumb}
                  className="chakra-switch__thumb"
                  data-checked={value ? "" : undefined}
                />
              </chakra.span>
              {description && <Text {...getLabelProps()}>{description}</Text>}
            </HStack>
          </chakra.label>
        </HStack>

        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Boolean.displayName = "Boolean";

export default Boolean;
