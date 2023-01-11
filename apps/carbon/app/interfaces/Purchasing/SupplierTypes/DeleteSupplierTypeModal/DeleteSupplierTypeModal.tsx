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
import type { SupplierType } from "../../types";

type DeleteSupplierTypeModalProps = {
  supplierTypeId: string;
  data: SupplierType;
  onCancel: () => void;
};

const DeleteSupplierTypeModal = ({
  supplierTypeId,
  data,
  onCancel,
}: DeleteSupplierTypeModalProps) => {
  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the {data?.name} supplier type? This
          cannot be undone.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form
            method="post"
            action={`/app/purchasing/supplier-types/delete/${supplierTypeId}`}
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

export default DeleteSupplierTypeModal;
