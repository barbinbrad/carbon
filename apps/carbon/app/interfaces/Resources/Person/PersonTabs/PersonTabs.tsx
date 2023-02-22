import {
  Card,
  CardBody,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { ProfileForm } from "~/interfaces/Account/Profile";
import type {
  PublicAttributes,
  PrivateAttributes,
} from "~/interfaces/Account/types";
import type { User } from "~/interfaces/Users/types";

type PersonTabsProps = {
  user: User;
  publicAttributes: PublicAttributes[];
  privateAttributes: PrivateAttributes[];
};

const PersonsTabs = ({ user }: PersonTabsProps) => {
  return (
    <Card w="full">
      <CardBody>
        <Tabs colorScheme="gray">
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Attributes</Tab>
            <Tab>Job</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfileForm user={user} />
            </TabPanel>
            <TabPanel>
              <p>Personal attributes</p>
            </TabPanel>
            <TabPanel>
              <p>Work center and shift</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default PersonsTabs;
