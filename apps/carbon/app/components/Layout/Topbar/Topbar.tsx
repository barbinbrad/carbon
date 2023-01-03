import { useColor } from "@carbon/react";
import { Button, Flex, GridItem, HStack, Kbd } from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Logo from "./Logo";
import useBreadcrumbs from "./useBreadcrumbs";

const Topbar = () => {
  const breadcrumbLinks = useBreadcrumbs();
  const borderColor = useColor("gray.200");

  return (
    <GridItem
      display="grid"
      gap={4}
      gridTemplateColumns="auto 1fr auto 1fr"
      // backdropFilter="auto"
      // backdropBlur="8px"
      bg={useColor("white")}
      borderBottom={1}
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      position="sticky"
      top={0}
      zIndex={1}
    >
      <Logo />
      <Breadcrumbs links={breadcrumbLinks} />
      <Button
        colorScheme="gray"
        leftIcon={<FaSearch />}
        variant="outline"
        border={1}
        borderColor={borderColor}
        borderStyle="solid"
        color="gray.500"
        w={200}
        mt={2}
      >
        <HStack w="full">
          <Flex flexGrow={1}>Search</Flex>
          <Kbd size="lg">/</Kbd>
        </HStack>
      </Button>
      <HStack py={2} pr={4} justifyContent="end">
        <Button
          colorScheme="gray"
          leftIcon={<BiHelpCircle />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Help
        </Button>
        <Button
          colorScheme="gray"
          leftIcon={<FaSearch />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Feedback
        </Button>
        <AvatarMenu />
      </HStack>
    </GridItem>
  );
};

export default Topbar;
