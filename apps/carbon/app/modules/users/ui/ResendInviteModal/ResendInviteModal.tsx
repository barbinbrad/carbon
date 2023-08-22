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
import { useFetcher } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { UserSelect } from "~/components/Selectors";
import { resendInviteValidator } from "~/modules/users";

type ResendInviteModalProps = {
  userIds: string[];
  isOpen: boolean;
  onClose: () => void;
};

const ResendInviteModal = ({
  userIds,
  isOpen,
  onClose,
}: ResendInviteModalProps) => {
  const fetcher = useFetcher();
  const isSingleUser = userIds.length === 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isSingleUser ? "Resend Invite" : "Resend Invites"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>
            Are you sure you want to resend an invite to
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
              action="/x/users/resend-invite"
              validator={resendInviteValidator}
              onSubmit={onClose}
              fetcher={fetcher}
            >
              {userIds.map((id, index) => (
                <input
                  key={id}
                  type="hidden"
                  name={`users[${index}]`}
                  value={id}
                />
              ))}
              <Button colorScheme="brand" type="submit">
                Send
              </Button>
            </ValidatedForm>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResendInviteModal;
