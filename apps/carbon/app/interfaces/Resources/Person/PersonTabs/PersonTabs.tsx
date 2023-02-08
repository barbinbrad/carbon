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
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>Profile</p>
            </TabPanel>
            <TabPanel>
              <p>Personal attributes</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default PersonsTabs;
