import {
  Avatar,
  AvatarGroup,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { MdOutlineClear } from "react-icons/md";
import useUserSelectContext from "../provider";

const SelectInput = () => {
  const {
    aria: { inputProps },
    innerProps: { disabled, isMulti, placeholder, testID },
    inputValue,
    instanceId,
    loading,
    refs: { inputRef },
    onClearInput,
    onInputBlur,
    onInputChange,
    onInputFocus,
  } = useUserSelectContext();

  return (
    <InputGroup>
      {isMulti ? (
        <InputLeftElement left={2}>
          <AvatarGroup size="xs" max={2}>
            <Avatar />
            <Avatar />
          </AvatarGroup>
        </InputLeftElement>
      ) : (
        <InputLeftElement>
          <Avatar size="xs" />
        </InputLeftElement>
      )}

      <Input
        {...inputProps}
        id={`${instanceId}:UserSelectionInput:searchInput:${testID}`}
        data-testid={`UserSelectionInput:searchInput:${testID}`}
        readOnly={disabled}
        isDisabled={disabled}
        onBlur={onInputBlur}
        onChange={onInputChange}
        onFocus={onInputFocus}
        placeholder={placeholder}
        spellCheck="false"
        ref={inputRef}
        type="text"
        value={inputValue}
        pl={isMulti ? "3.175rem" : undefined}
        pr="2.5rem"
      />

      <InputRightElement w="auto">
        <HStack spacing={1} mr={2}>
          {loading && <Spinner size="sm" />}
          {!loading && !disabled && inputValue.length > 0 && (
            <IconButton
              aria-label="Clear search query"
              icon={<MdOutlineClear />}
              onClick={onClearInput}
              colorScheme="gray"
              h={8}
              w={8}
              borderRadius={4}
              size="sm"
              variant="ghost"
            />
          )}
        </HStack>
      </InputRightElement>
    </InputGroup>
  );
};

export default SelectInput;
