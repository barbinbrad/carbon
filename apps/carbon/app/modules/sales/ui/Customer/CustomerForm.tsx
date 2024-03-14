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
  CustomerStatus,
  CustomerType,
  Employee,
  Hidden,
  Input,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import { customerValidator } from "~/modules/sales";
import { path } from "~/utils/path";

type CustomerFormProps = {
  initialValues: z.infer<typeof customerValidator>;
  type?: "card" | "modal";
  onClose?: () => void;
};

const CustomerForm = ({
  initialValues,
  type = "card",
  onClose,
}: CustomerFormProps) => {
  const permissions = usePermissions();
  const fetcher = useFetcher();

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "sales")
    : !permissions.can("create", "sales");

  return (
    <ModalCardProvider type={type}>
      <ModalCard onClose={onClose}>
        <ModalCardContent>
          <ValidatedForm
            method="post"
            action={isEditing ? undefined : path.to.newCustomer}
            validator={customerValidator}
            defaultValues={initialValues}
            onSubmit={onClose}
            fetcher={fetcher}
          >
            <ModalCardHeader>
              <ModalCardTitle>
                {isEditing ? "Customer Overview" : "New Customer"}
              </ModalCardTitle>
              {!isEditing && (
                <ModalCardDescription>
                  A customer is a business or person who buys your parts or
                  services.
                </ModalCardDescription>
              )}
            </ModalCardHeader>
            <ModalCardBody>
              <Hidden name="id" />
              <Hidden name="type" value={type} />
              <div
                className={cn(
                  "grid w-full gap-x-8 gap-y-4",
                  isEditing ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                <Input name="name" label="Name" />
                <Input name="taxId" label="Tax ID" />

                <CustomerType
                  name="customerTypeId"
                  label="Customer Type"
                  placeholder="Select Customer Type"
                />
                <CustomerStatus
                  name="customerStatusId"
                  label="Customer Status"
                  placeholder="Select Customer Status"
                />

                <Employee name="accountManagerId" label="Account Manager" />
                {/* <CustomFormFields table="customer" />*/}
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

export default CustomerForm;
