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
import { useLocation, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import {
  Abilities,
  Number,
  Submit,
  Supplier,
  SupplierContact,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { contractorValidator } from "~/modules/resources";
import type { TypeOfValidator } from "~/types/validators";

type ContractorFormProps = {
  initialValues: TypeOfValidator<typeof contractorValidator>;
};

const ContractorForm = ({ initialValues }: ContractorFormProps) => {
  const permissions = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const onClose = () => navigate(-1);

  const [supplier, setSupplier] = useState<string | null>(
    initialValues?.supplierId ?? null
  );

  const isEditing = !location.pathname.includes("new");
  const isDisabled = isEditing
    ? !permissions.can("update", "resources")
    : !permissions.can("create", "resources");

  return (
    <Drawer onClose={onClose} isOpen={true} size="sm">
      <ValidatedForm
        validator={contractorValidator}
        method="post"
        action={
          isEditing
            ? `/x/resources/contractors/${initialValues.id}`
            : "/x/resources/contractors/new"
        }
        defaultValues={initialValues}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isEditing ? "Edit" : "New"} Contractor</DrawerHeader>
          <DrawerBody pb={8}>
            <VStack spacing={4} alignItems="start">
              <Supplier
                name="supplierId"
                label="Supplier"
                isReadOnly={isEditing}
                onChange={({ value }) => setSupplier(value as string)}
              />
              <SupplierContact
                name="id"
                supplier={supplier ?? undefined}
                isReadOnly={isEditing}
              />
              <Abilities name="abilities" label="Abilities" />
              <Number
                name="hoursPerWeek"
                label="Hours per Week"
                helperText="The number of hours per week the supplier is available to work."
                min={0}
                max={10000}
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

export default ContractorForm;
