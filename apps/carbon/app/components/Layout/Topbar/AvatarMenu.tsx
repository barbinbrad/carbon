import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Avatar } from "~/components";
import { useUser } from "~/hooks";
import { path } from "~/utils/path";

const AvatarMenu = () => {
  const user = useUser();
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <Menu>
      <MenuButton
        arial-label="User Menu"
        as={Avatar}
        path={user.avatarUrl}
        title={name}
        role="button"
        size="sm"
        cursor="pointer"
      />
      <MenuList fontSize="sm" boxShadow="xl" minW={48}>
        <MenuItem>Signed in as {name}</MenuItem>
        <MenuDivider />
        <MenuItem as={Link} to={path.to.profile} icon={<CgProfile />}>
          My Profile
        </MenuItem>
        <Form method="post" action={path.to.logout}>
          <MenuItem type="submit" icon={<BiLogOut />}>
            Sign Out
          </MenuItem>
        </Form>
      </MenuList>
    </Menu>
  );
};

export default AvatarMenu;
