import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import type { EmployeeType } from "../../types";

type DeleteEmployeeTypeModalProps = {
  employeeTypeId: string;
  data: EmployeeType;
  onCancel: () => void;
};

const DeleteEmployeeTypeModal = ({
  data,
  onCancel,
}: DeleteEmployeeTypeModalProps) => {
  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the {data?.name} employee type? This
          cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form method="post">
            <Button colorScheme="red" type="submit">
              Delete
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteEmployeeTypeModal;
