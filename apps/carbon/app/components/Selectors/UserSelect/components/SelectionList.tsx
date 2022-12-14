import { useColor } from "@carbon/react";
import {
  Avatar,
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
import { MdPlaylistAdd, MdOutlineClear } from "react-icons/md";
import useUserSelectContext from "../provider";
import { isGroup } from "../useUserSelect";

const SelectionList = () => {
  const {
    innerProps: { checkedSelections, readOnly, width },
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
    <List w="full" maxW={width} mt={1}>
      {selected.map((item) => {
        const id = `UserSelection:SelectedItem-${item.id}`;
        const canExpand = isGroup(item) && !checkedSelections;

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
                  <Avatar size="sm" />
                  <Box display="flex" alignItems="center" flexGrow={2}>
                    <Text fontSize={14} noOfLines={1}>
                      {item.label}
                    </Text>
                  </Box>
                </>
              )}

              {canExpand && (
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

              {!readOnly && (
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
