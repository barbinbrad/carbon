import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaHistory } from "react-icons/fa";

const PartPreview = () => {
  return (
    <Card w="full">
      <CardHeader>
        <HStack justifyContent="space-between" alignItems="start">
          <Stack direction={["column", "column", "row"]} spacing={2}>
            <Heading size="md">FAS01233</Heading>
            <Text color="gray.500">5/16 Hex Nut</Text>
          </Stack>
          <Button onClick={() => alert("TODO")} leftIcon={<FaHistory />}>
            View History
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack direction={["column", "column", "row"]} spacing={8}>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Replenishment System</Text>
            <Text fontWeight="bold">Manufactured</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Part Type</Text>
            <Text fontWeight="bold">Inventory</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Unit of Measure</Text>
            <Text fontWeight="bold">Pieces</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Location</Text>
            <Text fontWeight="bold">--</Text>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default PartPreview;
