import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ValidatedForm } from "remix-validated-form";
import { UserSelect } from "~/components/Selectors";
import { deactivateUsersValidator } from "~/services/users";

type DeactivateEmployeesModalProps = {
  userIds: string[];
  isOpen: boolean;
  onClose: () => void;
};

const DeactivateEmployeesModal = ({
  userIds,
  isOpen,
  onClose,
}: DeactivateEmployeesModalProps) => {
  const isSingleUser = userIds.length === 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isSingleUser ? "Deactivate Employee" : "Deactivate Employees"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>
            Are you sure you want to deactive
            {isSingleUser ? " this user" : " these users"}?
          </Text>
          <UserSelect value={userIds} readOnly isMulti />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <ValidatedForm
              method="post"
              action="/app/users/deactivate"
              validator={deactivateUsersValidator}
              onSubmit={onClose}
            >
              {userIds.map((id, index) => (
                <input
                  key={id}
                  type="hidden"
                  name={`users[${index}]`}
                  value={id}
                />
              ))}
              <input
                type="hidden"
                name="redirectTo"
                value="/app/users/employees"
              />
              <Button colorScheme="red" type="submit">
                Deactivate
              </Button>
            </ValidatedForm>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeactivateEmployeesModal;
