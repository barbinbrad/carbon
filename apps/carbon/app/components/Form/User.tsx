import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import { useField } from "remix-validated-form";
import { UserSelect } from "../Selectors";
import type {
  SelectionItemInterface,
  UserSelectProps,
} from "../Selectors/UserSelect/types";

type UserProps = { name: string; label?: string } & UserSelectProps;

const User = ({ name, label, ...props }: UserProps) => {
  const { error, defaultValue, validate } = useField(name);
  const [selection, setSelection] = useState<string>(defaultValue);

  const handleChange = (items: SelectionItemInterface[]) => {
    if (items.length > 0) {
      const item = items[0];
      setSelection(item.id);
    } else {
      setSelection("");
    }
    validate();
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <input type="hidden" name={name} value={selection} />
      <UserSelect
        {...props}
        usersOnly
        isMulti={false}
        value={selection}
        onChange={handleChange}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default User;
