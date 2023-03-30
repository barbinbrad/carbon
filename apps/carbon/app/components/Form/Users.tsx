import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { useField } from "remix-validated-form";
import { UserSelect } from "../Selectors";
import type {
  IndividualOrGroup,
  UserSelectProps,
} from "../Selectors/UserSelect/types";

export type UsersProps = {
  name: string;
  label?: string;
  helperText?: string;
} & UserSelectProps;

const Users = ({ name, label, type, helperText, ...props }: UsersProps) => {
  const { error, defaultValue, validate } = useField(name);
  const [selections, setSelections] = useState<string[]>(defaultValue);

  const handleChange = (items: IndividualOrGroup[]) => {
    setSelections(
      items.map((item) =>
        "users" in item ? `group_${item.id}` : `user_${item.id}`
      )
    );
    validate();
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      {selections.map((selection, index) => (
        <input
          key={`${name}[${index}]`}
          type="hidden"
          name={`${name}[${index}]`}
          value={selection}
        />
      ))}
      <UserSelect
        {...props}
        type={type}
        isMulti
        value={stripUserGroupPrefix(selections)}
        onChange={handleChange}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

function stripUserGroupPrefix(items: string[]) {
  return items.map((item) => item.replace(/^(user|group)_/, ""));
}

export default Users;
