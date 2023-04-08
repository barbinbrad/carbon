import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
} from "@chakra-ui/react";

const PartPreview = () => {
  return (
    <Card w="full">
      <CardHeader>
        <HStack justifyContent="space-between">
          <Heading size="md">FAS01233</Heading>
          <Button>Button</Button>
        </HStack>
      </CardHeader>
      <CardBody></CardBody>
    </Card>
  );
};

export default PartPreview;
