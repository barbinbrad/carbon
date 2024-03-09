import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  VStack,
  useMount,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useFetcher, useNavigate } from "@remix-run/react";
import { Input, Select, Submit } from "~/components/Form";
import type { getEmployeeTypes } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import type { Result } from "~/types";
import { path } from "~/utils/path";

const CreateEmployeeModal = () => {
  const navigate = useNavigate();
  const formFetcher = useFetcher<Result>();
  const employeeTypeFetcher =
    useFetcher<Awaited<ReturnType<typeof getEmployeeTypes>>>();

  useMount(() => {
    employeeTypeFetcher.load(path.to.api.employeeTypes);
  });

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name,
    })) ?? [];

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) navigate(path.to.employeeAccounts);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ValidatedForm
          method="post"
          action={path.to.newEmployee}
          validator={createEmployeeValidator}
          // @ts-ignore
          fetcher={formFetcher}
          className="flex flex-col h-full"
        >
          <ModalHeader>
            <ModalTitle>Create an account</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <VStack spacing={4}>
              <Input name="email" label="Email" />
              <div className="grid grid-cols-2 gap-4 w-full">
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
              </div>
              <Select
                name="employeeType"
                label="Employee Type"
                options={employeeTypeOptions}
                placeholder="Select Employee Type"
              />
            </VStack>
            <ModalFooter>
              <HStack>
                <Submit>Create User</Submit>
              </HStack>
            </ModalFooter>
          </ModalBody>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default CreateEmployeeModal;
