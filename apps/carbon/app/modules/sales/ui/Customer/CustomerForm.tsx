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
  toast,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useFetcher } from "@remix-run/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect } from "react";
import type { z } from "zod";
import {
  CustomFormFields,
  CustomerStatus,
  CustomerType,
  Employee,
  Hidden,
  Input,
  Submit,
} from "~/components/Form";
import { usePermissions } from "~/hooks";
import type { Customer } from "~/modules/sales";
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
  const fetcher = useFetcher<PostgrestResponse<Customer>>();

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      // @ts-ignore
      toast.success(`Created customer: ${fetcher.data.data.name}`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(`Failed to create customer: ${fetcher.data.error.message}`);
    }
  }, [fetcher.data, fetcher.state, onClose, type]);

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
                  "grid w-full gap-x-8 gap-y-2",
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

                <CustomFormFields table="customer" />
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
