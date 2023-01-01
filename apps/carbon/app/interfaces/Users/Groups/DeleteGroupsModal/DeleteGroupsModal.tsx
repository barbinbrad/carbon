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

type DeleteGroupModalProps = {
  groupId: string;
  data: { id: string; name: string };
  onCancel: () => void;
};

const DeleteGroupModal = ({ data, onCancel }: DeleteGroupModalProps) => {
  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete {data?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete the group: {data?.name}? This cannot
          be undone.
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

export default DeleteGroupModal;
