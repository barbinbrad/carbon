import { Loading } from "@carbon/react";
import type { IconProps } from "@chakra-ui/react";
import { Box, Icon, List, ListItem, MenuIcon, Text } from "@chakra-ui/react";
import { FaCheck, FaChevronRight } from "react-icons/fa";
import Empty from "~/components/Data/Empty";
import type { OptionGroup, SelectionItemInterface } from "../types";
import useUserSelectContext from "../provider";
import { useGroupStyles, useOptionStyles } from "./useStyles";

const UserTreeSelect = () => {
  const {
    aria: { listBoxProps },
    groups,
    innerProps: { isMulti },
    loading,
    onMouseOver,
    refs: { listBoxRef },
  } = useUserSelectContext();

  return (
    <List
      {...listBoxProps}
      aria-multiselectable={isMulti}
      ref={listBoxRef}
      onMouseOver={onMouseOver}
      overflow="auto"
      maxH={300}
      my="1"
      display="flex"
      flexDirection="column"
    >
      {loading ? (
        <Loading />
      ) : groups.length > 0 ? (
        groups.map((group) => <Group key={group.uid} group={group} />)
      ) : (
        <Empty text={"No options available"} />
      )}
    </List>
  );
};

const MoreIcon = ({ isExpanded }: { isExpanded: boolean }) => (
  <Icon
    as={FaChevronRight}
    w={4}
    h={4}
    transition="transform .25s ease"
    transform={isExpanded ? "rotate(-0.25turn)" : undefined}
  />
);

const Group = ({ group }: { group: OptionGroup }) => {
  const {
    onGroupCollapse,
    onGroupExpand,
    focusedId,
    onSelect,
    onDeselect,
    selectionItemsByCode,
  } = useUserSelectContext();

  const isFocused = group.uid === focusedId;
  const isExpanded = group.expanded && group.items.length > 0;
  const sx = useGroupStyles(isFocused, isExpanded);

  return (
    <ListItem
      as="li"
      id={group.uid}
      tabIndex={0}
      role="treeitem"
      aria-expanded={isExpanded}
      borderRadius="md"
      outline="none"
    >
      <Box
        role="treeitem"
        onClick={() =>
          group.expanded ? onGroupCollapse(group.uid) : onGroupExpand(group.uid)
        }
        sx={sx}
      >
        <Text noOfLines={1}>{group.label}</Text>
        <MoreIcon isExpanded={isExpanded} />
      </Box>
      {isExpanded && (
        <List role="group" display="flex" flexDirection="column">
          {group.items.map((item) => {
            const isDisabled = item.selectionCode in []; // TODO
            const isFocused = item.uid === focusedId;
            const isSelected = item.selectionCode in selectionItemsByCode;

            return (
              <Option
                key={item.uid}
                id={item.uid}
                item={item}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isSelected={isSelected}
                onClick={() => (isSelected ? onDeselect(item) : onSelect(item))}
              />
            );
          })}
        </List>
      )}
    </ListItem>
  );
};

const CheckIcon = (iconProps: IconProps) => (
  <Icon as={FaCheck} {...iconProps} />
);

const Option = ({
  id,
  item,
  isDisabled,
  isFocused,
  isSelected,
  onClick,
}: {
  id?: string;
  item: SelectionItemInterface;
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const sx = useOptionStyles(isFocused, isSelected, isDisabled);
  const label =
    "people" in item ? `${item.label} (${item.people.length})` : item.label;

  return (
    <ListItem
      as="li"
      id={id}
      background={"red.100"}
      tabIndex={0}
      aria-selected={isSelected}
      role="treeitem"
      onClick={onClick}
      sx={sx}
    >
      <MenuIcon>
        <CheckIcon
          display="block"
          marginEnd="0.75rem"
          fontSize="0.8rem"
          w={4}
          h={4}
          opacity={isSelected ? 1 : 0}
        />
      </MenuIcon>
      <Text noOfLines={1}>{label}</Text>
    </ListItem>
  );
};

export default UserTreeSelect;
