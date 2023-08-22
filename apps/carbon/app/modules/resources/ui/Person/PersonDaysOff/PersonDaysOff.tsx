import { Box, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

type PersonDaysOffProps = {};

const PersonDaysOff = (props: PersonDaysOffProps) => {
  return (
    <Card w="full">
      <CardHeader>
        <Heading size="md">Days Off</Heading>
      </CardHeader>
      <CardBody>
        <Box color="gray.500" p={4} w="full" textAlign="center">
          No days off scheduled
        </Box>
      </CardBody>
    </Card>
  );
};

export default PersonDaysOff;
