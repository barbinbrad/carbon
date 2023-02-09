import {
  Card,
  CardBody,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

const PersonsTabs = () => {
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
              <p>Profile</p>
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
