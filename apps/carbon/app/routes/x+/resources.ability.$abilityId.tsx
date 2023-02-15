import { useColor } from "@carbon/react";
import {
  Box,
  Heading,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ParentSize } from "@visx/responsive";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Input, Submit } from "~/components/Form";
import { AbilityChart } from "~/interfaces/Resources/Abilities";
import type { AbilityDatum } from "~/interfaces/Resources/types";
import {
  abilityTitleValidator,
  updateAbilityValidator,
} from "~/services/resources";

export async function loader({ request }: LoaderArgs) {
  return json({
    data: [
      { id: 0, week: 0, value: 10 },
      { id: 1, week: 1, value: 50 },
      { id: 2, week: 4, value: 80 },
      { id: 3, week: 8, value: 100 },
    ],
    weeks: 8,
  });
}

export default function AbilitiesRoute() {
  const ability = useLoaderData<typeof loader>();
  const editingTitle = useDisclosure();
  const [data, setData] = useState<AbilityDatum[]>(ability.data);
  const [weeks, setWeeks] = useState<number>(ability.weeks);

  const updateWeeks = (_: string, newWeeks: number) => {
    const scale = 1 + (newWeeks - weeks) / weeks;
    setData((prevData) =>
      prevData.map((datum) => ({
        ...datum,
        week: Math.round(datum.week * scale * 10) / 10,
      }))
    );
    setWeeks(newWeeks);
  };

  return (
    <>
      <Box bg={useColor("white")} w="full">
        <HStack w="full" justifyContent="space-between" p={4}>
          {editingTitle.isOpen ? (
            <ValidatedForm
              validator={abilityTitleValidator}
              method="post"
              defaultValues={{
                title: "Painting",
              }}
            >
              <Hidden name="id" />
              <HStack spacing={2}>
                <Input
                  autoFocus
                  name="title"
                  variant="unstyled"
                  fontWeight="bold"
                  fontSize="xl"
                />
                <Submit size="sm">Save</Submit>
                <IconButton
                  aria-label="Cancel"
                  variant="ghost"
                  icon={<IoMdClose />}
                  onClick={editingTitle.onClose}
                />
              </HStack>
            </ValidatedForm>
          ) : (
            <HStack spacing={1} onClick={editingTitle.onOpen}>
              <Heading size="md">Painting</Heading>
              <IconButton aria-label="Edit" variant="ghost" icon={<MdEdit />} />
            </HStack>
          )}

          <HStack spacing={2}>
            <Text fontSize="sm">Weeks to Learn:</Text>
            <NumberInput
              maxW="100px"
              size="sm"
              min={1}
              value={weeks}
              onChange={updateWeeks}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <ValidatedForm
              validator={updateAbilityValidator}
              method="post"
              action="/x/resources/ability/$abilityId"
            >
              <Hidden name="id" value="1" />
              <Hidden name="data" value={JSON.stringify(data)} />
              <Submit size="sm">Save</Submit>
            </ValidatedForm>
          </HStack>
        </HStack>
        <Box w="full" h="50vh">
          <ParentSize>
            {({ height, width }) => (
              <AbilityChart
                parentHeight={height}
                parentWidth={width}
                data={data}
                onDataChange={setData}
              />
            )}
          </ParentSize>
        </Box>
      </Box>
    </>
  );
}
