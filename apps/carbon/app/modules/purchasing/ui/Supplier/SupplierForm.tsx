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
import { Employee, Hidden, Input, Select, Submit } from "~/components/Form";
import { usePermissions, useRouteData } from "~/hooks";
import type { SupplierStatus, SupplierType } from "~/modules/purchasing";
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

  const routeData = useRouteData<{
    supplierTypes: SupplierType[];
    supplierStatuses: SupplierStatus[];
  }>(path.to.supplierRoot);

  const supplierTypeOptions =
    routeData?.supplierTypes?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  const supplierStatusOptions =
    routeData?.supplierStatuses?.map((status) => ({
      value: status.id,
      label: status.name,
    })) ?? [];

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
            action={
              isEditing
                ? undefined
                : type === "card"
                ? path.to.newSupplier
                : path.to.api.newSupplier
            }
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
              <div
                className={cn(
                  "grid w-full gap-x-8 gap-y-2",
                  isEditing ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                <VStack>
                  <Input autoFocus={!isEditing} name="name" label="Name" />
                  <Input name="taxId" label="Tax ID" />
                </VStack>
                <VStack>
                  <Select
                    name="supplierTypeId"
                    label="Supplier Type"
                    options={supplierTypeOptions}
                    placeholder="Select Supplier Type"
                  />
                  <Select
                    name="supplierStatusId"
                    label="Supplier Status"
                    options={supplierStatusOptions}
                    placeholder="Select Supplier Status"
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

export default SupplierForm;
