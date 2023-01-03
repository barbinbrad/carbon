import type { InputProps } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { useField } from "remix-validated-form";

type FormPasswordProps = InputProps & {
  name: string;
  label?: string;
  isRequired?: boolean;
};

const Password = forwardRef<HTMLInputElement, FormPasswordProps>(
  ({ name, label, isRequired, ...rest }, ref) => {
    const { getInputProps, error } = useField(name);
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        <InputGroup size="md">
          <Input
            {...getInputProps({
              id: name,
              ...rest,
            })}
            ref={ref}
            type={passwordVisible ? "text" : "password"}
          />
          <InputRightElement width="2.75rem">
            <IconButton
              aria-label={passwordVisible ? "Show password" : "Hide password"}
              icon={passwordVisible ? <BiShowAlt /> : <BiHide />}
              h="1.75rem"
              size="sm"
              variant="outline"
              tabIndex={-1}
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </InputRightElement>
        </InputGroup>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);

Password.displayName = "Password";

export default Password;
