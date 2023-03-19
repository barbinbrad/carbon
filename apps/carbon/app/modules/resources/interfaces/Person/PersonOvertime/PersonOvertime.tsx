import { Box, Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";

type PersonOvertimeProps = {};

const PersonOvertime = (props: PersonOvertimeProps) => {
  return (
    <Card w="full">
      <CardHeader>
        <Heading size="md">Overtime</Heading>
      </CardHeader>
      <CardBody>
        <Box color="gray.500" p={4} w="full" textAlign="center">
          No overtime scheduled
        </Box>
      </CardBody>
    </Card>
  );
};

export default PersonOvertime;
