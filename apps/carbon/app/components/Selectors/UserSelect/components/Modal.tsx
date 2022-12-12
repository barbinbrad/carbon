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
import useUserSelectContext from "../provider";

const UserSelectionModal = () => {
  const { modal } = useUserSelectContext();

  return (
    <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select People</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={modal.onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserSelectionModal;
