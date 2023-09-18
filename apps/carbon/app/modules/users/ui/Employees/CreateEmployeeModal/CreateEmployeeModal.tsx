import {
  Grid,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Input, Select, Submit } from "~/components/Form";
import type { EmployeeType } from "~/modules/users";
import { createEmployeeValidator } from "~/modules/users";
import type { Result } from "~/types";

const CreateEmployeeModal = () => {
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const formFetcher = useFetcher<Result>();
  const employeeTypeFetcher = useFetcher<PostgrestResponse<EmployeeType>>();

  useEffect(() => {
    employeeTypeFetcher.load("/api/users/employee-types");
  }, [employeeTypeFetcher]);

  const employeeTypeOptions =
    employeeTypeFetcher.data?.data?.map((et) => ({
      value: et.id,
      label: et.name,
    })) ?? [];

  return (
    <Modal
      initialFocusRef={initialFocusRef}
      isOpen={true}
      onClose={() => navigate(-1)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create an account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <ValidatedForm
            method="post"
            action="/x/users/employees/new"
            validator={createEmployeeValidator}
            // @ts-ignore
            fetcher={formFetcher}
          >
            <VStack spacing={4} alignItems="start" w="full">
              <Input ref={initialFocusRef} name="email" label="Email" />
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Input name="firstName" label="First Name" />
                <Input name="lastName" label="Last Name" />
              </Grid>
              <Select
                name="employeeType"
                label="Employee Type"
                isLoading={employeeTypeFetcher.state === "loading"}
                options={employeeTypeOptions}
                placeholder="Select Employee Type"
              />
              <HStack spacing={4}>
                <Submit>Create User</Submit>
              </HStack>
            </VStack>
          </ValidatedForm>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateEmployeeModal;
