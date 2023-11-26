import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Boolean,
  Input,
  InputControlled,
  Select,
  Submit,
  TextArea,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import { useSupabase } from "~/lib/supabase";
import type {
  PartGroupListItem,
  PartReplenishmentSystem,
  PartType,
  UnitOfMeasureListItem,
} from "~/modules/parts";
import { partValidator } from "~/modules/parts";
import { path } from "~/utils/path";

type PartFormValues = {
  id?: string;
  name: string;
  description?: string;
  partType?: PartType;
  partGroupId?: string;
  replenishmentSystem?: PartReplenishmentSystem;
  unitOfMeasureCode?: string;
  blocked?: boolean;
  active?: boolean;
};

type PartFormProps = {
  initialValues: PartFormValues;
};

const useNextPartIdShortcut = () => {
  const { supabase } = useSupabase();
  const [loading, setLoading] = useState<boolean>(false);
  const [partId, setPartId] = useState<string>("");

  const onPartIdChange = async (newPartId: string) => {
    if (newPartId.endsWith("...") && supabase) {
      setLoading(true);

      const prefix = newPartId.slice(0, -3);
      try {
        const { data } = await supabase
          ?.from("part")
          .select("id")
          .ilike("id", `${prefix}%`)
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.id) {
          const sequence = data.id.slice(prefix.length);
          const currentSequence = parseInt(sequence);
          const nextSequence = currentSequence + 1;
          const nextId = `${prefix}${nextSequence
            .toString()
            .padStart(
              sequence.length -
                (data.id.split(`${currentSequence}`)?.[1].length ?? 0),
              "0"
            )}`;
          setPartId(nextId);
        } else {
          setPartId(`${prefix}${(1).toString().padStart(9, "0")}`);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    } else {
      setPartId(newPartId);
    }
  };

  return { partId, onPartIdChange, loading };
};

const PartForm = ({ initialValues }: PartFormProps) => {
  const sharedPartsData = useRouteData<{
    partGroups: PartGroupListItem[];
    partTypes: PartType[];
    partReplenishmentSystems: PartReplenishmentSystem[];
    unitOfMeasures: UnitOfMeasureListItem[];
  }>(path.to.partRoot);

  const { partId, onPartIdChange, loading } = useNextPartIdShortcut();
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;

  const partGroupOptions =
    sharedPartsData?.partGroups.map((partGroup) => ({
      label: partGroup.name,
      value: partGroup.id,
    })) ?? [];

  const partTypeOptions =
    sharedPartsData?.partTypes.map((partType) => ({
      label: partType,
      value: partType,
    })) ?? [];

  const partReplenishmentSystemOptions =
    sharedPartsData?.partReplenishmentSystems.map(
      (partReplenishmentSystem) => ({
        label: partReplenishmentSystem,
        value: partReplenishmentSystem,
      })
    ) ?? [];

  const unitOfMeasureOptions =
    sharedPartsData?.unitOfMeasures.map((uom) => ({
      label: uom.name,
      value: uom.code,
    })) ?? [];

  return (
    <ValidatedForm
      method="post"
      validator={partValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">{isEditing ? "Part Details" : "New Part"}</Heading>
          {!isEditing && (
            <Text color="gray.500" fontWeight="normal">
              A part contains the information about a specific item that can be
              purchased or manufactured.
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <Grid
            gridTemplateColumns={
              isEditing ? ["1fr", "1fr", "1fr 1fr 1fr"] : "1fr"
            }
            gridColumnGap={8}
            gridRowGap={2}
            w="full"
          >
            <VStack alignItems="start" spacing={2} w="full">
              {isEditing ? (
                <Input name="id" label="Part ID" isReadOnly />
              ) : (
                <InputControlled
                  name="id"
                  label="Part ID"
                  helperText="Use ... to get the next part ID"
                  value={partId}
                  onChange={onPartIdChange}
                  isDisabled={loading}
                />
              )}

              <Input name="name" label="Name" />
              <TextArea name="description" label="Description" />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="replenishmentSystem"
                label="Replenishment System"
                options={partReplenishmentSystemOptions}
              />
              <Select
                name="partType"
                label="Part Type"
                options={partTypeOptions}
              />
              <Select
                name="unitOfMeasureCode"
                label="Unit of Measure"
                options={unitOfMeasureOptions}
              />
            </VStack>
            <VStack alignItems="start" spacing={2} w="full">
              <Select
                name="partGroupId"
                label="Part Group"
                options={partGroupOptions}
              />
              <Boolean name="blocked" label="Blocked" />
              {isEditing && <Boolean name="active" label="Active" />}
            </VStack>
          </Grid>
        </CardBody>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "parts")
                : !permissions.can("create", "parts")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </Card>
    </ValidatedForm>
  );
};

export default PartForm;
