import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import useCreate from "./useCreate";

const Create = () => {
  const createLinks = useCreate();

  if (!createLinks.length) return null;

  return (
    <Menu>
      <MenuButton
        arial-label="User Menu"
        as={Button}
        variant="solid"
        colorScheme="brand"
        size="sm"
        cursor="pointer"
      >
        Create
      </MenuButton>
      <MenuList fontSize="sm" boxShadow="xl" minW={48}>
        {createLinks.map((link) => (
          <MenuItem key={link.to} as={Link} to={link.to} icon={link.icon}>
            {link.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Create;
