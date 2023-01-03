import type { StackProps } from "@chakra-ui/react";
import { Heading, Text, VStack } from "@chakra-ui/react";

type SectionTitleProps = StackProps & {
  title: string;
  subtitle?: string;
};

const SectionTitle = ({ title, subtitle, ...props }: SectionTitleProps) => {
  return (
    <VStack spacing={2} alignItems="start" w="full" my={4} {...props}>
      <Heading size="md">{title}</Heading>
      {subtitle && (
        <Text fontSize={14} color="gray.500">
          {subtitle}
        </Text>
      )}
    </VStack>
  );
};

export default SectionTitle;
