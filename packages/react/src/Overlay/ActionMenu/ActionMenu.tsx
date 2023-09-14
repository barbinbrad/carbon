import { IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

type ActionMenuProps = PropsWithChildren<{
  icon?: JSX.Element;
  disabled?: boolean;
}>;

const ActionMenu = ({ children, disabled, icon }: ActionMenuProps) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="Expand options"
        icon={icon ? icon : <BsThreeDotsVertical />}
        colorScheme="gray"
        isDisabled={disabled}
        variant="outline"
        onClick={(e) => e.stopPropagation()}
      />

      <MenuList fontSize="sm" boxShadow="xl">
        {children}
      </MenuList>
    </Menu>
  );
};

export default ActionMenu;
