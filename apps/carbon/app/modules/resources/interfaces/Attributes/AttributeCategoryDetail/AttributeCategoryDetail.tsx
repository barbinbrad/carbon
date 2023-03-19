import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  List,
  ListItem,
  Tag,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useFetcher } from "@remix-run/react";
import { Reorder } from "framer-motion";
import { useMemo, useState } from "react";
import { AiOutlineNumber } from "react-icons/ai";
import { BiText } from "react-icons/bi";
import { BsCalendarDate, BsPencilSquare, BsToggleOn } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoMdTrash } from "react-icons/io";
import { MdOutlineDragIndicator } from "react-icons/md";
import { ConfirmDelete } from "~/components/Modals";
import type {
  Attribute,
  AttributeCategoryDetail as AttributeCategoryDetailType,
} from "~/modules/resources";
import { useUrlParams } from "~/hooks";

type AttributeCategoryDetailProps = {
  attributeCategory: AttributeCategoryDetailType;
  onClose: () => void;
};

const AttributeCategoryDetail = ({
  attributeCategory,
  onClose,
}: AttributeCategoryDetailProps) => {
  const [params] = useUrlParams();
  const sortOrderFetcher = useFetcher();

  const attributeMap = useMemo(
    () =>
      Array.isArray(attributeCategory.userAttribute)
        ? attributeCategory.userAttribute.reduce<
            Record<string, AttributeCategoryDetailType["userAttribute"]>
          >((acc, attribute) => {
            return {
              ...acc,
              [attribute.id]: attribute,
            };
          }, {})
        : {},
    [attributeCategory]
  );

  const [sortOrder, setSortOrder] = useState(
    Array.isArray(attributeCategory.userAttribute)
      ? attributeCategory.userAttribute
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((attribute) => attribute.id)
      : []
  );

  const onReorder = (newOrder: string[]) => {
    let updates: Record<string, number> = {};
    newOrder.forEach((id, index) => {
      if (id !== sortOrder[index]) {
        updates[id] = index + 1;
      }
    });
    setSortOrder(newOrder);
    updateSortOrder(updates);
  };

  const updateSortOrder = (updates: Record<string, number>) => {
    let formData = new FormData();
    formData.append("updates", JSON.stringify(updates));
    sortOrderFetcher.submit(formData, { method: "post" });
  };

  const deleteModal = useDisclosure();
  const [selectedAttribute, setSelectedAttribute] = useState<
    Attribute | undefined
  >();

  const onDelete = (data?: Attribute) => {
    setSelectedAttribute(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedAttribute(undefined);
    deleteModal.onClose();
  };

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack justifyContent="space-between" w="full" pr={8}>
              <span>{attributeCategory.name}</span>
              <Tag
                size="lg"
                borderRadius="full"
                variant={attributeCategory.public ? "solid" : "outline"}
                colorScheme={attributeCategory.public ? "green" : "gray"}
              >
                <TagLabel>
                  {attributeCategory.public ? "Public" : "Private"}
                </TagLabel>
              </Tag>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            {Array.isArray(attributeCategory?.userAttribute) && (
              <List
                as={Reorder.Group}
                axis="y"
                values={sortOrder}
                onReorder={onReorder}
                spacing={2}
              >
                {sortOrder.map((sortId) => {
                  return (
                    <ListItem
                      key={sortId}
                      as={Reorder.Item}
                      value={sortId}
                      rounded="lg"
                    >
                      <HStack>
                        <IconButton
                          aria-label="Drag handle"
                          icon={<MdOutlineDragIndicator />}
                          variant="ghost"
                        />
                        <Text flexGrow={1}>
                          {
                            // @ts-ignore
                            attributeMap[sortId]?.name
                          }
                        </Text>
                        <Button
                          isDisabled
                          leftIcon={getIcon(
                            // @ts-ignore
                            attributeMap[sortId]?.attributeDataType
                          )}
                          variant="ghost"
                        >
                          {
                            // @ts-ignore
                            attributeMap[sortId]?.attributeDataType?.label ??
                              "Unknown"
                          }
                        </Button>

                        <IconButton
                          as={Link}
                          // @ts-ignore
                          to={sortId.toString()}
                          aria-label="Edit"
                          icon={<BsPencilSquare />}
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<IoMdTrash />}
                          variant="outline"
                          onClick={() =>
                            // @ts-ignore
                            onDelete(attributeMap[sortId])
                          }
                        />
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </DrawerBody>
          <DrawerFooter>
            <Button
              as={Link}
              to={`new?${params.toString()}`}
              colorScheme="brand"
              size="md"
            >
              New Attribute
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ConfirmDelete
        isOpen={deleteModal.isOpen}
        action={`/x/resources/attribute/delete/${selectedAttribute?.id}`}
        name={selectedAttribute?.name ?? ""}
        text={`Are you sure you want to deactivate the ${selectedAttribute?.name} attribute?`}
        onCancel={onDeleteCancel}
      />
    </>
  );
};

function getIcon({
  isBoolean,
  isDate,
  isNumeric,
  isText,
  isUser,
}: {
  isBoolean: boolean;
  isDate: boolean;
  isNumeric: boolean;
  isText: boolean;
  isUser: boolean;
}) {
  if (isBoolean) return <BsToggleOn />;
  if (isDate) return <BsCalendarDate />;
  if (isNumeric) return <AiOutlineNumber />;
  if (isText) return <BiText />;
  if (isUser) return <CgProfile />;
}

export default AttributeCategoryDetail;
