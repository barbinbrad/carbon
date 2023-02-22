import { useColor } from "@carbon/react";
import {
  Box,
  Button,
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
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { ParentSize } from "@visx/responsive";
import { useState } from "react";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdEdit, MdOutlineArrowBackIos } from "react-icons/md";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Hidden, Input, Submit } from "~/components/Form";
import {
  AbilityChart,
  AbilityEmployeesTable,
} from "~/interfaces/Resources/Abilities";
import type { AbilityDatum } from "~/interfaces/Resources/types";
import { requirePermissions } from "~/services/auth";
import {
  abilityNameValidator,
  getAbility,
  updateAbility,
  abilityCurveValidator,
} from "~/services/resources";
import { flash } from "~/services/session";
import { error, success } from "~/utils/result";

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
    weeks:
      // @ts-ignore
      ability.data.curve?.data[ability.data.curve?.data.length - 1].week ?? 0,
  });
}

export async function action({ request, params }: ActionArgs) {
  const { client } = await requirePermissions(request, {
    update: "resources",
  });

  const { abilityId } = params;
  if (!abilityId) {
    throw new Error("Ability ID not found");
  }

  const formData = await request.formData();

  if (formData.get("intent") === "name") {
    const validation = await abilityNameValidator.validate(formData);
    if (validation.error) {
      return validationError(validation.error);
    }

    const { name } = validation.data;
    const updateAbilityName = await updateAbility(client, abilityId, {
      name,
    });
    if (updateAbilityName.error) {
      return redirect(
        `/x/resources/ability/${abilityId}`,
        await flash(
          request,
          error(updateAbilityName.error, "Failed to update ability name")
        )
      );
    }
  }

  if (formData.get("intent") === "curve") {
    const validation = await abilityCurveValidator.validate(formData);
    if (validation.error) {
      return validationError(validation.error);
    }

    const { data, shadowWeeks } = validation.data;
    const updateAbilityCurve = await updateAbility(client, abilityId, {
      curve: {
        data: JSON.parse(data),
      },
      shadowWeeks,
    });
    if (updateAbilityCurve.error) {
      return redirect(
        `/x/resources/ability/${abilityId}`,
        await flash(
          request,
          error(updateAbilityCurve.error, "Failed to update ability data")
        )
      );
    }
  }

  return redirect(
    `/x/resources/ability/${abilityId}`,
    await flash(request, success("Ability updated"))
  );
}

export default function AbilitiesRoute() {
  const { ability, weeks } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const editingTitle = useDisclosure();
  const [data, setData] = useState<AbilityDatum[]>(
    // @ts-ignore
    ability.curve?.data ?? []
  );
  const [time, setTime] = useState<number>(weeks);
  const [controlledShadowWeeks, setControlledShadowWeeks] = useState<number>(
    ability.shadowWeeks ?? 0
  );

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

  const updateShadowTime = (_: string, newShadowTime: number) => {
    setControlledShadowWeeks(newShadowTime);
  };

  return (
    <>
      <Box bg={useColor("white")} w="full" position="relative">
        <HStack w="full" justifyContent="space-between" p={4}>
          {editingTitle.isOpen ? (
            <ValidatedForm
              validator={abilityNameValidator}
              method="post"
              action={`/x/resources/ability/${ability.id}`}
              defaultValues={{
                name: ability.name,
              }}
              onSubmit={editingTitle.onClose}
            >
              <Hidden name="intent" value="name" />
              <HStack spacing={2}>
                <IconButton
                  aria-label="Back"
                  variant="ghost"
                  icon={<MdOutlineArrowBackIos />}
                  onClick={() => navigate("/x/resources/abilities")}
                />
                <Input
                  autoFocus
                  name="name"
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
            <HStack spacing={2}>
              <IconButton
                aria-label="Back"
                variant="ghost"
                icon={<MdOutlineArrowBackIos />}
                onClick={() => navigate("/x/resources/abilities")}
              />
              <Heading size="md">{ability.name}</Heading>
              <IconButton
                aria-label="Edit"
                variant="ghost"
                icon={<MdEdit />}
                onClick={editingTitle.onOpen}
              />
            </HStack>
          )}

          <HStack spacing={2}>
            <Text fontSize="sm">Weeks Shadowing:</Text>
            <NumberInput
              maxW="100px"
              size="sm"
              min={0}
              max={time}
              value={controlledShadowWeeks}
              onChange={updateShadowTime}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
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
              validator={abilityCurveValidator}
              method="post"
              action={`/x/resources/ability/${ability.id}`}
            >
              <Hidden name="intent" value="curve" />
              <Hidden name="data" value={JSON.stringify(data)} />
              <Hidden name="shadowWeeks" value={controlledShadowWeeks} />
              <Submit size="sm">Save</Submit>
            </ValidatedForm>
          </HStack>
        </HStack>
        <Box w="full" h="33vh">
          <ParentSize>
            {({ height, width }) => (
              <AbilityChart
                parentHeight={height}
                parentWidth={width}
                data={data}
                shadowWeeks={controlledShadowWeeks}
                onDataChange={setData}
              />
            )}
          </ParentSize>
        </Box>
        <Box position="absolute" bottom={-4} right={4} zIndex={3}>
          <Button
            as={Link}
            to="employee/new"
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Employee
          </Button>
        </Box>
      </Box>
      <AbilityEmployeesTable
        employees={ability.employeeAbility ?? []}
        weeks={weeks}
        shadowWeeks={ability.shadowWeeks}
      />
      <Outlet />
    </>
  );
}
