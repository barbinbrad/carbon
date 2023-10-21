import { useColor } from "@carbon/react";
import { Box, IconButton } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { AiOutlineCodeSandbox } from "react-icons/ai";
import { path } from "~/utils/path";

const Logo = () => {
  return (
    <Box
      borderRight={1}
      borderRightColor={useColor("gray.200")}
      borderRightStyle="solid"
    >
      <IconButton
        as={Link}
        variant="outline"
        colorScheme="gray"
        size="lg"
        borderRadius={0}
        border="none"
        aria-label="Carbon"
        icon={<AiOutlineCodeSandbox />}
        to={path.to.authenticatedRoot}
      />
    </Box>
  );
};

export default Logo;
