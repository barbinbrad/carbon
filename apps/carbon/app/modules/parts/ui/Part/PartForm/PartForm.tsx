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
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Input, Select, Submit, TextArea } from "~/components/Form";
import { usePermissions } from "~/hooks";
import type {
  PartGroupListItem,
  PartReplenishmentSystem,
  PartType,
  UnitOfMeasureListItem,
} from "~/modules/parts";
import { partValidator } from "~/modules/parts";

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
  partGroups: PartGroupListItem[];
  partTypes: PartType[];
  partReplenishmentSystems: PartReplenishmentSystem[];
  unitOfMeasures: UnitOfMeasureListItem[];
};

const PartForm = ({
  initialValues,
  partGroups,
  partTypes,
  partReplenishmentSystems,
  unitOfMeasures,
}: PartFormProps) => {
  const permissions = usePermissions();
  const isEditing = initialValues.id !== undefined;

  const partGroupOptions = partGroups.map((partGroup) => ({
    label: partGroup.name,
    value: partGroup.id,
  }));

  const partTypeOptions = partTypes.map((partType) => ({
    label: partType,
    value: partType,
  }));

  const partReplenishmentSystemOptions = partReplenishmentSystems.map(
    (partReplenishmentSystem) => ({
      label: partReplenishmentSystem,
      value: partReplenishmentSystem,
    })
  );

  const unitOfMeasureOptions = unitOfMeasures.map((uom) => ({
    label: uom.name,
    value: uom.code,
  }));

  return (
    <ValidatedForm
      method="post"
      validator={partValidator}
      defaultValues={initialValues}
    >
      <Card w="full">
        <CardHeader>
          <Heading size="md">{isEditing ? "Part Basics" : "New Part"}</Heading>
          {!isEditing && (
            <Text color="gray.500">
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
              <Input name="id" label="Part ID" isReadOnly={isEditing} />
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
