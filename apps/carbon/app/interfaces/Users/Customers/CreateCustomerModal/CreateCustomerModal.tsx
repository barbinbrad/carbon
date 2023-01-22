import {
  Grid,
  HStack,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useRef, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Customer, Submit, CustomerContact } from "~/components/Form";
import { createCustomerValidator } from "~/services/users";
import type { Result } from "~/types";

const CreateCustomerModal = () => {
  const navigate = useNavigate();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const formFetcher = useFetcher<Result>();
  const [customer, setCustomer] = useState<string | undefined>(undefined);
  const [contact, setContact] = useState<
    | {
        email: string;
        firstName: string;
        lastName: string;
      }
    | undefined
  >();

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
            action="/app/users/customers/new"
            validator={createCustomerValidator}
            // @ts-ignore
            fetcher={formFetcher}
          >
            <VStack spacing={4} alignItems="start" w="full">
              <Customer
                name="customer"
                label="Customer"
                onChange={(newValue) =>
                  setCustomer(newValue?.value as string | undefined)
                }
              />
              <CustomerContact
                name="id"
                label="Customer Contact"
                customer={customer}
                onChange={(newValue) => {
                  // @ts-ignore
                  setContact(newValue?.contact);
                }}
              />
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  isReadOnly
                  value={contact?.email ?? ""}
                  variant="filled"
                />
              </FormControl>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    isReadOnly
                    value={contact?.firstName ?? ""}
                    variant="filled"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    isReadOnly
                    value={contact?.lastName ?? ""}
                    variant="filled"
                  />
                </FormControl>
              </Grid>

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

export default CreateCustomerModal;
