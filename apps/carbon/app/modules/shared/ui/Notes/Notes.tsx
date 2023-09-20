import { HTML, useColor } from "@carbon/react";
import { formatTimeAgo } from "@carbon/utils";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form } from "@remix-run/react";
import { Fragment } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Avatar } from "~/components";
import { Hidden, RichText, Submit } from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import { usePermissions, useUser } from "~/hooks";
import type { Note } from "~/modules/shared";
import { noteValidator } from "~/modules/shared";

type NotesProps = {
  documentId: string;
  notes: Note[];
};

const Notes = ({ documentId, notes }: NotesProps) => {
  const user = useUser();
  const permissions = usePermissions();
  const isEmployee = permissions.is("employee");

  const borderColor = useColor("gray.200");

  if (!isEmployee) return null;

  return (
    <Box w="full">
      <SectionTitle>Notes</SectionTitle>

      {notes.length > 0 ? (
        <Grid
          gridTemplateColumns="auto 1fr"
          gridColumnGap={4}
          gridRowGap={8}
          w="full"
        >
          {notes.map((note) => {
            if (!note.user || Array.isArray(note.user))
              throw new Error("Invalid user");
            return (
              <Fragment key={note.id}>
                <Avatar path={note.user.avatarUrl} />
                <VStack spacing={1} w="full" alignItems="start">
                  <Text fontWeight="bold">{note.user?.fullName}</Text>
                  <HTML text={note.note} />
                  <HStack spacing={4}>
                    <Text color="gray.500">
                      {formatTimeAgo(note.createdAt)}
                    </Text>
                    {user.id === note.user.id && (
                      <Form
                        method="post"
                        action={`/x/shared/notes/${note.id}/delete`}
                      >
                        <Button
                          type="submit"
                          variant="link"
                          fontWeight="normal"
                          size="md"
                        >
                          Delete
                        </Button>
                      </Form>
                    )}
                  </HStack>
                </VStack>
              </Fragment>
            );
          })}
        </Grid>
      ) : (
        <Box color="gray.500" p={4} w="full" textAlign="center">
          No notes
        </Box>
      )}

      <Box pt={8} w="full">
        <ValidatedForm
          method="post"
          action={`/x/shared/notes/new`}
          resetAfterSubmit
          validator={noteValidator}
        >
          <Hidden name="documentId" value={documentId} />
          <VStack spacing={3} w="full">
            <Box
              w="full"
              borderColor={borderColor}
              borderWidth={1}
              borderStyle="solid"
              borderRadius="md"
            >
              <RichText name="note" minH={160} />
            </Box>
            <Flex justifyContent="flex-end" w="full">
              <Submit>Add Note</Submit>
            </Flex>
          </VStack>
        </ValidatedForm>
      </Box>
    </Box>
  );
};

export default Notes;
