import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Avatar } from "~/components/Avatar";
import { Form, Link } from "@remix-run/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { useUser } from "~/hooks";

const AvatarMenu = () => {
  const user = useUser();

  return (
    <Menu>
      <MenuButton
        as={Avatar}
        path={user.avatarUrl}
        role="button"
        name=""
        size="sm"
        cursor="pointer"
      />
      <MenuList fontSize="sm" boxShadow="xl" minW={48}>
        <MenuItem>Signed in as {`${user.firstName} ${user.lastName}`}</MenuItem>
        <MenuDivider />
        <MenuItem as={Link} to="/app/account/profile" icon={<CgProfile />}>
          My Profile
        </MenuItem>
        <Form method="post" action="/logout">
          <MenuItem type="submit" icon={<BiLogOut />}>
            Sign Out
          </MenuItem>
        </Form>
      </MenuList>
    </Menu>
  );
};

export default AvatarMenu;
