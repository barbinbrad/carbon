import { Heading, Text, VStack } from "@chakra-ui/react";

type PageTitleProps = {
  title: string;
  subtitle?: string;
};

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  return (
    <VStack spacing={2} alignItems="start" w="full" mb={4}>
      <Heading size="lg">{title}</Heading>
      {subtitle && (
        <Text fontSize={14} color="gray.500">
          {subtitle}
        </Text>
      )}
    </VStack>
  );
};

export default PageTitle;
