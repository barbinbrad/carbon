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
import type { Attribute } from "../../types";

type DeleteAttributeModalProps = {
  data?: Attribute;
  isOpen: boolean;
  onCancel: () => void;
};

const DeleteAttributeModal = ({
  data,
  isOpen,
  onCancel,
}: DeleteAttributeModalProps) => {
  if (Array.isArray(data?.userAttributeCategory))
    throw new Error("received an array for userAttributeCategory");

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to deactivate the {data?.name} attribute from{" "}
          {data?.userAttributeCategory?.name!}?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form
            method="post"
            action={`/app/users/attribute/delete/${data?.id}`}
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

export default DeleteAttributeModal;
