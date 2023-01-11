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
import type { CustomerType } from "../../types";

type DeleteCustomerTypeModalProps = {
  customerTypeId: string;
  data: CustomerType;
  onCancel: () => void;
};

const DeleteCustomerTypeModal = ({
  customerTypeId,
  data,
  onCancel,
}: DeleteCustomerTypeModalProps) => {
  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the {data?.name} customer type? This
          cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form
            method="post"
            action={`/app/sales/customer-types/delete/${customerTypeId}`}
          >
            <Button colorScheme="red" type="submit">
              Delete
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCustomerTypeModal;
