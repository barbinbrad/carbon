import { useColor } from "@carbon/react";
import {
  Box,
  Checkbox,
  Flex,
  IconButton,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { MdOutlineClear, MdPlaylistAdd } from "react-icons/md";
import { Avatar } from "~/components";
import useUserSelectContext from "../provider";
import { isGroup } from "../useUserSelect";

const SelectionList = () => {
  const {
    innerProps: {
      alwaysSelected,
      checkedSelections,
      readOnly,
      selectionsMaxHeight,
      width,
    },
    instanceId,
    selectionItemsById,
    onDeselect,
    onExplode,
    onToggleChecked,
  } = useUserSelectContext();

  const selected = useMemo(
    () =>
      Object.values(selectionItemsById).sort((a, b) =>
        a.label < b.label ? -1 : 0
      ),
    [selectionItemsById]
  );

  const background = useColor("gray.100");

  return (
    <List
      w="full"
      maxW={width}
      mt={1}
      maxH={selectionsMaxHeight}
      overflowY={selectionsMaxHeight ? "auto" : undefined}
    >
      {selected.map((item) => {
        const id = `UserSelection:SelectedItem-${item.id}`;
        const canExpand = !checkedSelections && !readOnly && isGroup(item);

        return (
          <ListItem
            key={item.id}
            p={2}
            borderRadius="md"
            _hover={{ background }}
          >
            <Flex direction="row" gap={2} data-testid={`${id}`}>
              {checkedSelections ? (
                <>
                  <Checkbox
                    id={`${instanceId}:${id}:checkbox`}
                    data-testid={id}
                    isChecked={item.isChecked}
                    onChange={() => onToggleChecked(item)}
                    size="lg"
                    flexGrow={2}
                  >
                    <Text fontSize={14} noOfLines={1}>
                      {item.label}
                    </Text>
                  </Checkbox>
                </>
              ) : (
                <>
                  {"fullName" in item ? (
                    <Avatar
                      name={item.fullName ?? undefined}
                      path={item.avatarUrl}
                      size="sm"
                    />
                  ) : (
                    <Avatar name={item.name} path={null} size="sm" />
                  )}

                  <Box display="flex" alignItems="center" flexGrow={2}>
                    <Text fontSize={14} noOfLines={1}>
                      {item.label}
                    </Text>
                  </Box>
                </>
              )}

              {!!canExpand && (
                <Tooltip label="Expand">
                  <IconButton
                    aria-label={`Expand ${item.label}`}
                    icon={<MdPlaylistAdd />}
                    size="sm"
                    onClick={() => onExplode(item)}
                    variant="outline"
                  />
                </Tooltip>
              )}

              {!readOnly && !alwaysSelected.includes(item.id) && (
                <Tooltip label="Remove">
                  <IconButton
                    aria-label={`Remove ${item.label}`}
                    icon={<MdOutlineClear />}
                    size="sm"
                    onClick={() => onDeselect(item)}
                    variant="outline"
                  />
                </Tooltip>
              )}
            </Flex>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SelectionList;
