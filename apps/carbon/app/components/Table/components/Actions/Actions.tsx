import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { IoMdCheckboxOutline } from "react-icons/io";
import type { TableAction } from "../../types";

type ActionsProps<T> = {
  actions: TableAction<T>[];
  selectedRows: T[];
};

const Actions = <T extends Object>({
  actions,
  selectedRows,
}: ActionsProps<T>) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={Button}
        leftIcon={<IoMdCheckboxOutline />}
        disabled={selectedRows.length === 0}
        colorScheme={selectedRows.length === 0 ? "gray" : "brand"}
        variant="ghost"
      >
        Actions
      </MenuButton>
      <MenuList fontSize="sm" boxShadow="xl">
        {actions.map((action) => (
          <MenuItem
            key={action.label}
            onClick={() => action.onClick(selectedRows)}
            disabled={action.disabled}
            icon={action.icon}
          >
            {action.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Actions;
