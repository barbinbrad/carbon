import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { BiPlus } from "react-icons/bi";
import useNewMenu from "./useNewMenu";

const NewMenu = () => {
  const newMenuLinks = useNewMenu();

  if (!newMenuLinks.length) return null;

  return (
    <Menu>
      <MenuButton
        arial-label="User Menu"
        as={IconButton}
        icon={<BiPlus />}
        variant="ghost"
        size="sm"
        cursor="pointer"
      />
      <MenuList fontSize="sm" boxShadow="xl" minW={48}>
        {newMenuLinks.map((link) => (
          <MenuItem key={link.to} as={Link} to={link.to} icon={link.icon}>
            {link.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NewMenu;
