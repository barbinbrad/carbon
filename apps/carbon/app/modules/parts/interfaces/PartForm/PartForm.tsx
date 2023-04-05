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
import {
  Boolean,
  Hidden,
  Input,
  Number,
  Select,
  Submit,
  Supplier,
  TextArea,
} from "~/components/Form";
import { SectionTitle } from "~/components/Layout";
import {
  partCostValidator,
  partPlanningValidator,
  partPurchasingValidator,
  partValidator,
} from "../../services";

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

  const isEditing = true; // initialValues.id !== undefined;

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
                  <Tab isDisabled={!isEditing}>Planning</Tab>
                  <Tab isDisabled={!isEditing}>Inventory</Tab>
                  <Tab isDisabled={!isEditing}>Sale Price</Tab>
                </TabList>

                <TabPanels>
                  {/* Part Basics */}
                  <TabPanel id="part-basics">
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
                            name="replenishmentSystem"
                            label="Replenishment System"
                            options={[
                              { label: "Purchased", value: "Purchased" },
                            ]}
                          />
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
                            options={[{ label: "Each", value: "EA" }]}
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="partGroupId"
                            label="Part Group"
                            options={[{ label: "Fasteners", value: "FAS" }]}
                          />
                          <Boolean name="blocked" label="Blocked" />
                        </VStack>
                      </Grid>
                      <Box my={4}>
                        <Submit>Save</Submit>
                      </Box>
                    </ValidatedForm>
                  </TabPanel>
                  {/* Purchasing */}
                  <TabPanel id="part-purchasing">
                    <ValidatedForm
                      method="post"
                      validator={partPurchasingValidator}
                    >
                      <SectionTitle title="Purchasing" />
                      <Hidden name="partId" />
                      <Grid
                        gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
                        gridColumnGap={8}
                        gridRowGap={2}
                        w="full"
                      >
                        <VStack alignItems="start" spacing={2} w="full">
                          <Supplier name="supplierId" label="Supplier" />
                          <Input
                            name="supplierPartNumber"
                            label="Supplier Part Number"
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Number name="leadTime" label="Lead Time" />
                          <Select
                            name="purchasingUnitOfMeasureCode"
                            label="Purchasing Unit of Measure"
                            options={[{ label: "Each", value: "EA" }]}
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Boolean
                            name="purchasingBlocked"
                            label="Purchasing Blocked"
                          />
                        </VStack>
                      </Grid>
                      <Box my={4}>
                        <Submit>Save</Submit>
                      </Box>
                    </ValidatedForm>
                  </TabPanel>
                  {/* Manufacturing */}
                  <TabPanel id="part-manufacturing">
                    <ValidatedForm method="post" validator={partValidator}>
                      <SectionTitle title="Manufacturing" />
                      <Hidden name="partId" />
                      <Grid
                        gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
                        gridColumnGap={8}
                        gridRowGap={2}
                        w="full"
                      >
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="manufacturingPolicy"
                            label="Manufacturing Policy"
                            options={[
                              {
                                label: "Make to Stock",
                                value: "Make to Stock",
                              },
                            ]}
                          />
                          <Select
                            name="routingId"
                            label="Routing ID"
                            options={[{ label: "", value: "" }]}
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Number
                            name="scrapPercentage"
                            label="Scrap Percentage"
                          />
                          <Number name="lotSize" label="Lot Size" />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Boolean
                            name="manufacturingBlocked"
                            label="Manufacturing Blocked"
                          />
                          <Boolean
                            name="requiresConfiguration"
                            label="Requires Configuration"
                          />
                        </VStack>
                      </Grid>
                      <Box my={4}>
                        <Submit>Save</Submit>
                      </Box>
                    </ValidatedForm>
                  </TabPanel>
                  {/* Costing */}
                  <TabPanel id="part-costing">
                    <ValidatedForm method="post" validator={partCostValidator}>
                      <SectionTitle title="Costs & Posting" />
                      <Hidden name="partId" />
                      <Grid
                        gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
                        gridColumnGap={8}
                        gridRowGap={2}
                        w="full"
                      >
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="costingMethod"
                            label="Part Costing Method"
                            options={[{ label: "Standard", value: "Standard" }]}
                          />
                          <Number name="standardCost" label="Standard Cost" />
                          <Number name="unitCost" label="Unit Cost" />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="salesAccountId"
                            label="Sales Account"
                            options={[{ label: "", value: "" }]}
                          />
                          <Select
                            name="inventoryAccountId"
                            label="Inventory Account"
                            options={[{ label: "", value: "" }]}
                          />
                          <Select
                            name="discountAccountId"
                            label="Discount Account"
                            options={[{ label: "", value: "" }]}
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Number name="salesHistory" label="Sales History" />
                          <Number
                            name="salesHistoryQty"
                            label="Sales History Qty"
                          />
                          <Boolean
                            name="costIsAdjusted"
                            label="Cost Is Adjusted"
                          />
                        </VStack>
                      </Grid>
                      <Box my={4}>
                        <Submit>Save</Submit>
                      </Box>
                    </ValidatedForm>
                  </TabPanel>
                  {/* Planning */}
                  <TabPanel id="part-planning">
                    <ValidatedForm
                      method="post"
                      validator={partPlanningValidator}
                    >
                      <SectionTitle title="Planning" />
                      <Hidden name="partId" />
                      <Grid
                        gridTemplateColumns={["1fr", "1fr", "1fr 1fr 1fr"]}
                        gridColumnGap={8}
                        gridRowGap={2}
                        w="full"
                      >
                        <VStack alignItems="start" spacing={2} w="full">
                          <Select
                            name="reorderingPolicy"
                            label="Reordering Policy"
                            options={[
                              {
                                label: "Demand-Based Reorder",
                                value: "Demand-Based Reorder",
                              },
                            ]}
                          />
                          <Boolean name="critical" label="Critical" />
                          <Number
                            name="safetyStockQuantity"
                            label="Safety Stock Quantity"
                          />
                          <Number
                            name="safetyStockLeadTime"
                            label="Safety Stock Lead Time (Days)"
                          />
                          <Number
                            name="minimumOrderQuantity"
                            label="Minimum Order Quantity"
                          />
                          <Number
                            name="maximumOrderQuantity"
                            label="Maximum Order Quantity"
                          />
                          <Number name="orderMultiple" label="Order Multiple" />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Number
                            name="demandAccumulationPeriod"
                            label="Demand Accumulation Period (Days)"
                          />
                          <Number
                            name="demandReschedulingPeriod"
                            label="Rescheduling Period (Days)"
                          />
                          <Boolean
                            name="demandAccumulationIncludesInventory"
                            label="Demand Includes Inventory"
                          />
                        </VStack>
                        <VStack alignItems="start" spacing={2} w="full">
                          <Number name="reorderPoint" label="Reorder Point" />
                          <Number
                            name="reorderQuantity"
                            label="Reorder Quantity"
                          />
                          <Number
                            name="reorderMaximumInventory"
                            label="Reorder Maximum Inventory"
                          />
                          <Number
                            name="reorderOverflowLevel"
                            label="Reorder Overflow Level"
                          />
                          <Number
                            name="reorderTimeBucket"
                            label="Reorder Time Bucket (Days)"
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
