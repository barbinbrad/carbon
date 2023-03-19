import { formatDate } from "@carbon/utils";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Grid,
  Icon,
  Text,
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import type { IconType } from "react-icons";

import { BsCheckLg, BsBarChartFill } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import type { EmployeeAbility } from "~/modules/resources";
import { getTrainingStatus } from "~/modules/resources";
import { AbilityEmployeeStatus } from "~/modules/resources";

type PersonAbilitiesProps = {
  abilities: EmployeeAbility[];
};

const AbilityIcons: Record<
  AbilityEmployeeStatus,
  {
    color: string;
    bg: string;
    icon: IconType;
    description: string;
  }
> = {
  [AbilityEmployeeStatus.Complete]: {
    color: "white",
    bg: "green.500",
    icon: BsCheckLg,
    description: "Fully trained for",
  },
  [AbilityEmployeeStatus.InProgress]: {
    color: "white",
    bg: "blue.400",
    icon: BsBarChartFill,
    description: "Currently training for",
  },
  [AbilityEmployeeStatus.NotStarted]: {
    color: "gray.700",
    bg: "gray.200",
    icon: FaThumbsUp,
    description: "Not started training for",
  },
};

const PersonAbilities = ({ abilities }: PersonAbilitiesProps) => {
  return (
    <Card w="full">
      <CardHeader>
        <Heading size="md">Abilities</Heading>
      </CardHeader>
      <CardBody>
        {abilities?.length > 0 ? (
          <List spacing={4}>
            {abilities.map((employeeAbility) => {
              const abilityStatus =
                getTrainingStatus(employeeAbility) ??
                AbilityEmployeeStatus.NotStarted;

              const { color, bg, icon, description } =
                AbilityIcons[abilityStatus];

              if (
                !employeeAbility.ability ||
                Array.isArray(employeeAbility.ability)
              ) {
                return null;
              }

              return (
                <ListItem key={employeeAbility.id}>
                  <Grid
                    key={employeeAbility.id}
                    gridTemplateColumns="auto 1fr auto"
                    gridColumnGap={4}
                  >
                    <Center
                      bg={bg}
                      borderRadius="full"
                      color={color}
                      h={10}
                      w={10}
                    >
                      <Icon as={icon} w={5} h={5} />
                    </Center>
                    <Flex h="full" alignItems="center">
                      <Text>
                        {description}{" "}
                        <Text
                          as={Link}
                          fontWeight="bold"
                          to={`/x/resources/ability/${employeeAbility.ability.id}/employee/${employeeAbility.id}`}
                        >
                          {employeeAbility.ability.name}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex h="full" alignItems="center">
                      <Text color="gray.500" fontSize="sm">
                        {formatDate(employeeAbility.lastTrainingDate, {
                          month: "short",
                          year: "numeric",
                        })}
                      </Text>
                    </Flex>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box color="gray.500" p={4} w="full" textAlign="center">
            No abilities added
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

export default PersonAbilities;
