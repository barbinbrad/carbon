import { useColor } from "@carbon/react";
import {
  Box,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ParentSize } from "@visx/responsive";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Hidden, Submit } from "~/components/Form";
import { AbilityChart } from "~/interfaces/Resources/Abilities";
import type { AbilityDatum } from "~/interfaces/Resources/types";
import { updateAbilityValidator } from "~/services/resources";

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
  const [data, setData] = useState<AbilityDatum[]>(ability.data);
  const [weeks, setWeeks] = useState<number>(ability.weeks);

  const updateWeeks = (_: string, newWeeks: number) => {
    if (newWeeks < weeks) {
      // we need to make sure we're scaling down the data set
      setData((prevData) => {
        const newData: AbilityDatum[] = [];

        prevData.forEach((datum, index) => {
          if (index === prevData.length - 1) {
            newData.push({ ...datum, week: newWeeks });
          } else if (index > 0 && datum.week >= newWeeks) {
            const prevDatum = newData[index - 1];
            const biscet =
              Math.round(((prevDatum.week + newWeeks) / 2) * 10) / 10;
            newData.push({ ...datum, week: biscet });
          } else {
            newData.push(datum);
          }
        });

        return newData;
      });
    } else {
      const scale = 1 + (newWeeks - weeks) / weeks;
      setData((prevData) =>
        prevData.map((datum) => ({
          ...datum,
          week: Math.round(datum.week * scale * 10) / 10,
        }))
      );
    }
    setWeeks(newWeeks);
  };

  return (
    <>
      <Box bg={useColor("white")} w="full">
        <HStack w="full" justifyContent="space-between" p={4}>
          <Heading size="md">Painting</Heading>
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
