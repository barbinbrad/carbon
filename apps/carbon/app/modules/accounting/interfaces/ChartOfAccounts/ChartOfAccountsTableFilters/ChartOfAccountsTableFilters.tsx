import { DatePicker, Select, useColor } from "@carbon/react";
import {
  Button,
  Grid,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { parseDate } from "@internationalized/date";
import { Link } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { MdCalendarMonth, MdClose } from "react-icons/md";
import { usePermissions, useUrlParams } from "~/hooks";
import { incomeBalanceType } from "~/modules/accounting/services";

const CurrenciesTableFilters = () => {
  const [params, setParams] = useUrlParams();
  const permissions = usePermissions();
  const borderColor = useColor("gray.200");

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  const incomeBalanceOptions = incomeBalanceType.map((type) => ({
    label: type,
    value: type,
  }));

  return (
    <HStack
      px={4}
      py={3}
      justifyContent="space-between"
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      w="full"
    >
      <HStack spacing={2}>
        <Select
          // @ts-ignore
          minW={200}
          placeholder="Income/Balance Sheet"
          options={incomeBalanceOptions}
          size="sm"
          isClearable
          onChange={(newValue) => setParams({ incomeBalance: newValue?.value })}
        />
        <Popover placement="bottom" closeOnBlur>
          <PopoverTrigger>
            <Button variant="solid" leftIcon={<MdCalendarMonth />}>
              Date Range
            </Button>
          </PopoverTrigger>
          <PopoverContent w={360} boxShadow="xl">
            <PopoverHeader>
              <Text fontSize="sm">Edit date range</Text>
              <Text fontSize="xs" color="gray.500">
                Select date range to filter net change and balance at date
              </Text>
            </PopoverHeader>
            <PopoverArrow />
            <PopoverBody maxH="50vh">
              <Grid
                gridTemplateColumns={"1fr 3fr"}
                gridRowGap={2}
                alignItems="center"
              >
                <Text fontSize="sm" color="gray.500">
                  Start Date
                </Text>
                <DatePicker
                  // @ts-ignore
                  value={startDate ? parseDate(startDate) : null}
                  onChange={(value) =>
                    setParams({ startDate: value.toString() })
                  }
                />
                <Text fontSize="sm" color="gray.500">
                  End Date
                </Text>
                <DatePicker
                  // @ts-ignore
                  value={endDate ? parseDate(endDate) : null}
                  onChange={(value) => setParams({ endDate: value.toString() })}
                />
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        {[...params.entries()].length > 0 && (
          <Button
            size="sm"
            rightIcon={<MdClose />}
            onClick={() =>
              setParams({
                incomeBalance: undefined,
                startDate: undefined,
                endDate: undefined,
              })
            }
          >
            Reset
          </Button>
        )}
      </HStack>
      <HStack spacing={2}>
        {permissions.can("create", "accounting") && (
          <Button
            as={Link}
            to={`new?${params.toString()}`}
            colorScheme="brand"
            leftIcon={<IoMdAdd />}
          >
            New Account
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default CurrenciesTableFilters;
