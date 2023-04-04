import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { Boolean, Input, Select, Submit, TextArea } from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import { partValidator } from "../../services";

type PartFormValues = {
  id?: string;
  name: string;
  description: string;
};

type PartFormProps = {
  initialValues: PartFormValues;
};

const PartForm = ({ initialValues }: PartFormProps) => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const isEditing = initialValues.id !== undefined;

  return (
    <Drawer onClose={onClose} isOpen size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isEditing ? initialValues.id : "New Part"}</DrawerHeader>
        <DrawerBody>
          <Grid
            gridTemplateColumns={["1fr", "1fr", "5fr 2fr"]}
            gridColumnGap={8}
            w="full"
          >
            <Box w="full">
              <Tabs colorScheme="gray">
                <TabList>
                  <Tab>Part</Tab>
                  <Tab isDisabled={!isEditing}>Purchasing</Tab>
                  <Tab isDisabled={!isEditing}>Manufacturing</Tab>
                  <Tab isDisabled={!isEditing}>Costing</Tab>
                  <Tab isDisabled={!isEditing}>Inventory</Tab>
                  <Tab isDisabled={!isEditing}>Sale Price</Tab>
                  <Tab isDisabled={!isEditing}>Planning</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <ValidatedForm method="post" validator={partValidator}>
                      <SectionTitle title="Part" />
                      <Grid
                        gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
                        gridColumnGap={8}
                        gridRowGap={2}
                        w="full"
                      >
                        <VStack alignItems="start" spacing={2} w="full">
                          <Input name="id" label="Part ID" />
                          <Input name="name" label="Name" />
                          <TextArea name="description" label="Description" />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="partType"
                            label="Part Type"
                            options={[
                              { label: "Inventory", value: "Inventory" },
                            ]}
                          />
                          <Select
                            name="unitOfMeasureCode"
                            label="Unit of Measure"
                            options={[{ label: "Pieces", value: "PCS" }]}
                          />
                          <Boolean name="blocked" label="Blocked" />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="partGroupId"
                            label="Part Group"
                            options={[{ label: "Fasteners", value: "FAS" }]}
                          />
                          <Input
                            name="manufacturerPartNumber"
                            label="Manufactured Part Number"
                          />
                        </VStack>
                      </Grid>
                      <Box my={4}>
                        <Submit>Save</Submit>
                      </Box>
                    </ValidatedForm>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <VStack
              spacing={8}
              w="full"
              alignItems="start"
              py={[8, 8, 0]}
            ></VStack>
          </Grid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PartForm;
