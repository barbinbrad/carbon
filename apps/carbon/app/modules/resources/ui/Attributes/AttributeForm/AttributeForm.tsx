import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Array,
  Boolean,
  Hidden,
  Input,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { attributeValidator } from "~/modules/resources";
import { DataType } from "~/modules/users";
import type { TypeOfValidator } from "~/types/validators";
import { path } from "~/utils/path";

type AttributeFormProps = {
  initialValues: TypeOfValidator<typeof attributeValidator>;
  dataTypes: {
    id: number;
    label: string;
    isBoolean: boolean;
    isDate: boolean;
    isList: boolean;
    isNumeric: boolean;
    isText: boolean;
  }[];
  onClose: () => void;
};

const AttributeForm = ({
  initialValues,
  dataTypes,
  onClose,
}: AttributeFormProps) => {
  const permissions = usePermissions();

  const options =
    dataTypes?.map((dt) => ({
      value: dt.id,
      label: dt.label,
    })) ?? [];

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  const [isList, setIsList] = useState(
    initialValues.attributeDataTypeId === DataType.List
  );

  const onChangeCheckForListType = (selected: {
    value: string | number;
    label: string;
  }) => {
    setIsList(Number(selected.value) === DataType.List);
  };

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={attributeValidator}
        method="post"
        action={
          isEditing
            ? path.to.attribute(initialValues.id!)
            : path.to.newAttribute
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Attribute</DrawerHeader>
          <DrawerBody pb={8}>
            <Hidden name="id" />
            <VStack spacing={2} alignItems="start">
              <Input name="name" label="Name" />
              <Hidden name="userAttributeCategoryId" />

              <Select
                name="attributeDataTypeId"
                label="Data Type"
                isReadOnly={isEditing}
                helperText={
                  isEditing ? "Data type cannot be changed" : undefined
                }
                options={options}
                onChange={onChangeCheckForListType}
              />
              {isList && <Array name="listOptions" label="List Options" />}
              <Boolean
                name="canSelfManage"
                label="Self Managed"
                description="Users can update this value for themselves"
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <HStack spacing={2}>
              <Submit isDisabled={isDisabled}>Save</Submit>
              <Button
                size="md"
                colorScheme="gray"
                variant="solid"
                onClick={onClose}
              >
                Cancel
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </ValidatedForm>
    </Drawer>
  );
};

export default AttributeForm;
