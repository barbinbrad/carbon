import { useColor } from "@carbon/react";
import { HStack } from "@chakra-ui/react";
import { DebouncedInput } from "~/components/Search";

const SequencesTableFilters = () => {
  const borderColor = useColor("gray.200");
  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <DebouncedInput
          param="name"
          size="sm"
          minW={180}
          placeholder="Search"
        />
      </HStack>
    </HStack>
  );
};

export default SequencesTableFilters;
