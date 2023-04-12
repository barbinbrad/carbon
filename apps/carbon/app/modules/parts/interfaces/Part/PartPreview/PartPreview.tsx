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
import { useParams } from "@remix-run/react";
import { FaHistory } from "react-icons/fa";
import { useRouteData } from "~/hooks";
import type { PartSummary } from "~/modules/parts";

const PartPreview = () => {
  const { partId } = useParams();
  if (!partId) throw new Error("Could not find partId");
  const routeData = useRouteData<PartSummary>(`/x/part/${partId}`);

  return (
    <Card w="full">
      <CardHeader>
        <HStack justifyContent="space-between" alignItems="start">
          <Stack direction={["column", "column", "row"]} spacing={2}>
            <Heading size="md">{routeData?.id}</Heading>
            <Text color="gray.500">{routeData?.name}</Text>
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
            <Text fontWeight="bold">{routeData?.replenishmentSystem}</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Part Type</Text>
            <Text fontWeight="bold">{routeData?.partType}</Text>
          </Stack>
          <Stack
            direction={["row", "row", "column"]}
            alignItems="start"
            justifyContent="space-between"
          >
            <Text color="gray.500">Unit of Measure</Text>
            <Text fontWeight="bold">{routeData?.unitOfMeasureCode}</Text>
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
