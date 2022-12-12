import {
  Avatar,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
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
    onShowModal,
  } = useUserSelectContext();

  return (
    <InputGroup>
      {!isMulti && (
        <InputLeftElement>
          <Avatar size="xs" />
        </InputLeftElement>
      )}

      <Input
        {...inputProps}
        id={`${instanceId}:UserSelectionInput:searchInput:${testID}`}
        data-testid={`UserSelectionInput:searchInput:${testID}`}
        readOnly={disabled}
        disabled={disabled}
        onBlur={onInputBlur}
        onChange={onInputChange}
        onFocus={onInputFocus}
        placeholder={placeholder}
        spellCheck="false"
        ref={inputRef}
        type="text"
        value={inputValue}
        pr={isMulti ? "5rem" : "2.5rem"}
      />

      <InputRightElement w="auto">
        <HStack spacing={1} mr={2}>
          {loading && <Spinner size="sm" />}
          {!loading && inputValue.length > 0 && (
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
          {isMulti && (
            <IconButton
              aria-label="Open user selection modal"
              data-testid={`UserSelectionInput:OpenFullDialogButton:${testID}`}
              disabled={disabled}
              onClick={onShowModal}
              size="sm"
              h="1.75rem"
              variant="solid"
              icon={<BsThreeDotsVertical />}
            />
          )}
        </HStack>
      </InputRightElement>
    </InputGroup>
  );
};

export default SelectInput;
