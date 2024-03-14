import {
  HStack,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  cn,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useFetcher } from "@remix-run/react";
import type { z } from "zod";
import {
  Employee,
  Hidden,
  Input,
  Submit,
  SupplierStatus,
  SupplierType,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { supplierValidator } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierFormProps = {
  initialValues: z.infer<typeof supplierValidator>;
  type?: "card" | "modal";
  onClose?: () => void;
};

const SupplierForm = ({
  initialValues,
  type = "card",
  onClose,
}: SupplierFormProps) => {
  const permissions = usePermissions();
  const fetcher = useFetcher();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  return (
    <ModalCardProvider type={type}>
      <ModalCard onClose={onClose}>
        <ModalCardContent>
          <ValidatedForm
            method="post"
            action={isEditing ? undefined : path.to.newSupplier}
            validator={supplierValidator}
            defaultValues={initialValues}
            onSubmit={onClose}
            fetcher={fetcher}
          >
            <ModalCardHeader>
              <ModalCardTitle>
                {isEditing ? "Supplier Overview" : "New Supplier"}
              </ModalCardTitle>
              {!isEditing && (
                <ModalCardDescription>
                  A supplier is a business or person who sells you parts or
                  services.
                </ModalCardDescription>
              )}
            </ModalCardHeader>
            <ModalCardBody>
              <Hidden name="id" />
              <Hidden name="type" value={type} />
              <div
                className={cn(
                  "grid w-full gap-x-8 gap-y-2",
                  isEditing ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                <Input autoFocus={!isEditing} name="name" label="Name" />
                <Input name="taxId" label="Tax ID" />

                <SupplierType
                  name="supplierTypeId"
                  label="Supplier Type"
                  placeholder="Select Supplier Type"
                />
                <SupplierStatus
                  name="supplierStatusId"
                  label="Supplier Status"
                  placeholder="Select Supplier Status"
                />

                <Employee name="accountManagerId" label="Account Manager" />

                {/* <CustomFormFields table="supplier" />*/}
              </div>
            </ModalCardBody>
            <ModalCardFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>Save</Submit>
              </HStack>
            </ModalCardFooter>
          </ValidatedForm>
        </ModalCardContent>
      </ModalCard>
    </ModalCardProvider>
  );
};

export default SupplierForm;
