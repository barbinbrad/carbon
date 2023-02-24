import {
  Card,
  CardBody,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Box,
  Icon,
} from "@chakra-ui/react";
import { BiLockAlt } from "react-icons/bi";
import { SectionTitle } from "~/components/Layout";
import { ProfileForm } from "~/interfaces/Account/Profile";
import type {
  PublicAttributes,
  PrivateAttributes,
} from "~/interfaces/Account/types";
import { UserAttributesForm } from "~/interfaces/Account/UserAttributes";
import type { User } from "~/interfaces/Users/types";
import { PersonNotes } from "~/interfaces/Resources/Person";
import type { Note } from "~/interfaces/Resources/types";

type PersonTabsProps = {
  user: User;
  publicAttributes: PublicAttributes[];
  privateAttributes: PrivateAttributes[];
  notes: Note[];
};

const PersonsTabs = ({
  user,
  publicAttributes,
  privateAttributes,
  notes,
}: PersonTabsProps) => {
  return (
    <Card w="full">
      <CardBody>
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Profile</Tab>
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
              {publicAttributes.map((category: PublicAttributes) => (
                <Box key={category.id} mb={8} w="full">
                  <SectionTitle title={category.name} />
                  <UserAttributesForm attributeCategory={category} />
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              {privateAttributes.map((category: PrivateAttributes) => (
                <Box key={category.id} mb={8} w="full">
                  <SectionTitle title={category.name} />
                  <UserAttributesForm attributeCategory={category} />
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              <PersonNotes notes={notes} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default PersonsTabs;
