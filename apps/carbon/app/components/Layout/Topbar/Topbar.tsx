import { useColor } from "@carbon/react";
import { Button, GridItem, HStack } from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";
import { BsChatSquare } from "react-icons/bs";
import { Search } from "~/components/Search";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Create from "./Create";

const Topbar = () => {
  const borderColor = useColor("gray.200");

  return (
    <GridItem
      bg={useColor("white")}
      borderBottom={1}
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      display="grid"
      gap={4}
      gridTemplateColumns="1fr auto 1fr"
      position="sticky"
      px={4}
      top={0}
      zIndex={1}
    >
      <Breadcrumbs />
      <Search />
      <HStack py={2} justifyContent="end" spacing={1}>
        <Create />
        <a
          target="_blank"
          href="https://github.com/barbinbrad/carbon/issues/new/choose"
          rel="noreferrer"
        >
          <Button
            colorScheme="gray"
            leftIcon={<BiHelpCircle />}
            variant="outline"
          >
            Help
          </Button>
        </a>
        <a
          target="_blank"
          href="https://github.com/barbinbrad/carbon/discussions/new/choose"
          rel="noreferrer"
        >
          <Button
            colorScheme="gray"
            leftIcon={<BsChatSquare />}
            variant="outline"
          >
            Feedback
          </Button>
        </a>
        <AvatarMenu />
      </HStack>
    </GridItem>
  );
};

export default Topbar;
