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
import { redirect } from "@remix-run/node";
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
import { requirePermissions } from "~/services/auth";
import {
  abilityTitleValidator,
  getAbility,
  updateAbilityValidator,
} from "~/services/resources";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
  });

  const { abilityId } = params;
  if (!abilityId) {
    return redirect(
      "/x/resources/abilities",
      await flash(request, error(null, "Ability ID is required"))
    );
  }

  const ability = await getAbility(client, abilityId);
  if (ability.error || !ability.data) {
    return redirect(
      "/x/resources/abilities",
      await flash(request, error(ability.error, "Failed to load ability"))
    );
  }

  return json({
    ability: ability.data,
    weeks: 4,
  });
}

export default function AbilitiesRoute() {
  const { ability, weeks } = useLoaderData<typeof loader>();
  const editingTitle = useDisclosure();
  const [data, setData] = useState<AbilityDatum[]>(ability.curve?.data);
  const [time, setTime] = useState<number>(weeks);

  const updateWeeks = (_: string, newWeeks: number) => {
    const scale = 1 + (newWeeks - time) / time;
    setData((prevData) =>
      prevData.map((datum) => ({
        ...datum,
        week: Math.round(datum.week * scale * 10) / 10,
      }))
    );
    setTime(newWeeks);
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
                id: ability.id,
                title: ability.name,
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
              <Heading size="md">{ability.name}</Heading>
              <IconButton aria-label="Edit" variant="ghost" icon={<MdEdit />} />
            </HStack>
          )}

          <HStack spacing={2}>
            <Text fontSize="sm">Weeks to Learn:</Text>
            <NumberInput
              maxW="100px"
              size="sm"
              min={1}
              value={time}
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
