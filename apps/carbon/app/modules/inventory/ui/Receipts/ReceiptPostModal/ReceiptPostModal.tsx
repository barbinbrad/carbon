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
} from "@chakra-ui/react";
import { Form, useNavigate } from "@remix-run/react";

type ReceiptPostModalProps = {};

const ReceiptPostModal = (props: ReceiptPostModalProps) => {
  const navigate = useNavigate();

  const onCancel = () => navigate(-1);

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Post Receipt</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to post this receipt? This cannot be undone.
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            <Button colorScheme="gray" onClick={onCancel}>
              Cancel
            </Button>
            <Form method="post">
              <input type="hidden" name="intent" value="receive" />
              <Button colorScheme="brand" type="submit">
                Receive
              </Button>
            </Form>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptPostModal;
