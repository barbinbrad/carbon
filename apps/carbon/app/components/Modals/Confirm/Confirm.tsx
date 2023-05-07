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

type ConfirmProps = {
  action: string;
  isOpen?: boolean;
  name: string;
  text: string;
  onCancel: () => void;
  onSubmit?: () => void;
};

const Confirm = ({
  action,
  isOpen = true,
  name,
  text,
  onCancel,
  onSubmit,
}: ConfirmProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{text}</ModalBody>

        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Form method="post" action={action} onSubmit={onSubmit}>
            <Button colorScheme="brand" type="submit">
              Confirm
            </Button>
          </Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Confirm;
