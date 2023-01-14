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
  Input,
  Hidden,
  Submit,
  Select,
} from "~/components/Form";
import { DataType } from "~/interfaces/Users/types";
import { attributeValidator } from "~/services/users";
import { mapRowsToOptions } from "~/utils/form";

type AttributeFormProps = {
  initialValues: {
    id?: number;
    name: string;
    userAttributeCategoryId: number;
    attributeDataTypeId?: number;
    listOptions?: string[];
    canSelfManage: boolean;
  };
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
  const options = mapRowsToOptions({
    data: dataTypes,
    value: "id",
    label: "label",
  });
  const isEditing = initialValues.id !== undefined;
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
            ? `/app/users/attribute/${initialValues.id}`
            : "/app/users/attribute/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Attribute</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={2} alignItems="start">
              <Hidden name="id" />
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
              <Submit>Save</Submit>
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
