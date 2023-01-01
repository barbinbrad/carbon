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
import type { AttributeCategory } from "../../types";

type DeleteAttributeCategoryModalProps = {
  data?: AttributeCategory;
  isOpen: boolean;
  onCancel: () => void;
};

const DeleteAttributeCategoryModal = ({
  data,
  isOpen,
  onCancel,
}: DeleteAttributeCategoryModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to deactivate the {data?.name} attribute
          category?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form
            method="post"
            action={`/app/users/attributes/delete/${data?.id}`}
            onSubmit={onCancel}
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

export default DeleteAttributeCategoryModal;
