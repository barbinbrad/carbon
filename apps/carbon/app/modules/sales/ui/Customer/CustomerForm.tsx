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
  VStack,
  cn,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useFetcher } from "@remix-run/react";
import type { z } from "zod";
import {
  Combobox,
  Employee,
  Hidden,
  Input,
  Select,
  Submit,
} from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { CustomerStatus, CustomerType } from "~/modules/sales";
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

  const routeData = useRouteData<{
    customerTypes: CustomerType[];
    customerStatuses: CustomerStatus[];
  }>(path.to.customerRoot);

  const customerTypeOptions =
    routeData?.customerTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const customerStatusOptions =
    routeData?.customerStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

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
            action={
              isEditing
                ? undefined
                : type === "card"
                ? path.to.newCustomer
                : path.to.api.newCustomer
            }
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
              <div
                className={cn(
                  "grid w-full gap-x-8 gap-y-2",
                  isEditing ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                <VStack>
                  <Input name="name" label="Name" />
                  <Input name="taxId" label="Tax ID" />
                </VStack>
                <VStack>
                  <Combobox
                    name="customerTypeId"
                    label="Customer Type"
                    options={customerTypeOptions}
                    placeholder="Select Customer Type"
                  />
                  <Select
                    name="customerStatusId"
                    label="Customer Status"
                    options={customerStatusOptions}
                    placeholder="Select Customer Status"
                  />
                </VStack>
                {isEditing && (
                  <>
                    <VStack>
                      <Employee
                        name="accountManagerId"
                        label="Account Manager"
                      />
                    </VStack>
                  </>
                )}
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
