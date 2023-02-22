import { formatTimeAgo } from "@carbon/utils";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, useParams } from "@remix-run/react";
import { Fragment } from "react";
import { ValidatedForm } from "remix-validated-form";
import { Avatar } from "~/components";
import { Submit, TextArea } from "~/components/Form";
import { usePermissions, useUser } from "~/hooks";
import type { Note } from "~/interfaces/Resources/types";
import { noteValidator } from "~/services/resources";

type PersonNoteProps = {
  notes: Note[];
};

const PersonNotes = ({ notes }: PersonNoteProps) => {
  const user = useUser();
  const permissions = usePermissions();

  const { personId } = useParams();
  if (!personId) throw new Error("Missing personId");

  const canCreate = permissions.can("create", "resources");
  const canUpdate = permissions.can("update", "resources");
  const canDelete = permissions.can("delete", "resources");

  return (
    <Card w="full">
      <CardHeader>
        <Heading size="md">Notes</Heading>
      </CardHeader>
      <CardBody>
        {notes.length > 0 ? (
          <Grid
            gridTemplateColumns="auto 1fr"
            gridColumnGap={4}
            gridRowGap={8}
            w="full"
          >
            {notes.map((note) => {
              if (Array.isArray(note.user)) throw new Error("Invalid user");
              return (
                <Fragment key={note.id}>
                  <Avatar path={user.avatarUrl} />
                  <VStack spacing={1} w="full" alignItems="start">
                    <Text fontWeight="bold">{note.user?.fullName}</Text>
                    <Text>{note.note}</Text>
                    <HStack spacing={4}>
                      <Text color="gray.500">
                        {formatTimeAgo(note.createdAt)}
                      </Text>
                      {(canDelete || canUpdate) &&
                        user.id === note.user?.id && (
                          <Form
                            method="post"
                            action={`/x/resources/person/${personId}/notes/delete/${note.id}`}
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
      </CardBody>
      {canCreate && (
        <CardFooter>
          <ValidatedForm
            method="post"
            action={`/x/resources/person/${personId}/notes/new`}
            validator={noteValidator}
            resetAfterSubmit
          >
            <VStack spacing={3} w="full">
              <Grid gridTemplateColumns="auto 1fr" gridColumnGap={4} w="full">
                <Avatar path={user.avatarUrl} />
                <TextArea name="note" />
              </Grid>
              <Flex justifyContent="flex-end" w="full">
                <Submit>Comment</Submit>
              </Flex>
            </VStack>
          </ValidatedForm>
        </CardFooter>
      )}
    </Card>
  );
};

export default PersonNotes;
