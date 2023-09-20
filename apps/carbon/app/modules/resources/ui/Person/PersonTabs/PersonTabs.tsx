import {
  Box,
  Card,
  CardBody,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams } from "@remix-run/react";
import { BiLockAlt } from "react-icons/bi";
import { SectionTitle } from "~/components/Layout";
import type { PrivateAttributes, PublicAttributes } from "~/modules/account";
import { ProfileForm, UserAttributesForm } from "~/modules/account";
import type { EmployeeJob } from "~/modules/resources";
import { PersonJob } from "~/modules/resources";
import type { Note } from "~/modules/shared";
import { Notes } from "~/modules/shared";
import type { User } from "~/modules/users";

type PersonTabsProps = {
  user: User;
  job: EmployeeJob;
  notes: Note[];
  publicAttributes: PublicAttributes[];
  privateAttributes: PrivateAttributes[];
};

const PersonsTabs = ({
  user,
  job,
  notes,
  publicAttributes,
  privateAttributes,
}: PersonTabsProps) => {
  const { personId } = useParams();
  if (!personId) throw new Error("Missing personId");

  return (
    <Card w="full">
      <CardBody>
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Job</Tab>
            <Tab>Public</Tab>
            <Tab>
              <Icon as={BiLockAlt} h={4} w={4} mr={2} /> Private
            </Tab>
            <Tab>
              <Icon as={BiLockAlt} h={4} w={4} mr={2} /> Notes
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfileForm user={user} />
            </TabPanel>
            <TabPanel>
              <PersonJob job={job} />
            </TabPanel>
            <TabPanel>
              {publicAttributes.length ? (
                publicAttributes.map((category: PublicAttributes) => (
                  <Box key={category.id} mb={8} w="full">
                    <SectionTitle>{category.name}</SectionTitle>
                    <UserAttributesForm attributeCategory={category} />
                  </Box>
                ))
              ) : (
                <Box color="gray.500" p={4} w="full" textAlign="center">
                  No public attributes
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              {privateAttributes.length ? (
                privateAttributes.map((category: PrivateAttributes) => (
                  <Box key={category.id} mb={8} w="full">
                    <SectionTitle>{category.name}</SectionTitle>
                    <UserAttributesForm attributeCategory={category} />
                  </Box>
                ))
              ) : (
                <Box color="gray.500" p={4} w="full" textAlign="center">
                  No private attributes
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              <Notes documentId={personId} notes={notes} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default PersonsTabs;
