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
  VStack,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { ConfirmDelete } from "~/components/Modals";

import { useUrlParams } from "~/hooks";
import type { AccountCategory, AccountSubcategory } from "~/modules/accounting";
import { path } from "~/utils/path";

type AccountCategoryDetailProps = {
  accountCategory: AccountCategory;
  accountSubcategories: AccountSubcategory[];
  onClose: () => void;
};

const AccountCategoryDetail = ({
  accountCategory,
  accountSubcategories,
  onClose,
}: AccountCategoryDetailProps) => {
  const [params] = useUrlParams();

  const deleteModal = useDisclosure();
  const [selectedAccountSubcategory, setSelectedAccountSubcategory] =
    useState<AccountSubcategory | null>(null);

  const onDelete = (data?: AccountSubcategory) => {
    if (!data) return;
    setSelectedAccountSubcategory(data);
    deleteModal.onOpen();
  };

  const onDeleteCancel = () => {
    setSelectedAccountSubcategory(null);
    deleteModal.onClose();
  };

  return (
    <>
      <Drawer onClose={onClose} isOpen={true} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <VStack spacing={2} w="full" alignItems="start">
              <HStack justifyContent="space-between" w="full" pr={8}>
                <span>{accountCategory.category}</span>
                <Tag
                  borderRadius="full"
                  variant="outline"
                  colorScheme={
                    accountCategory.incomeBalance === "Income Statement"
                      ? "green"
                      : "gray"
                  }
                >
                  <TagLabel>{accountCategory.incomeBalance}</TagLabel>
                </Tag>
              </HStack>
              <Text fontSize="sm" fontWeight="normal" color="gray.500">
                A list of subcategories in the {accountCategory.category}{" "}
                category.
              </Text>
            </VStack>
          </DrawerHeader>
          <DrawerBody>
            <List spacing={2}>
              {accountSubcategories.map((subcategory) => {
                return (
                  <ListItem key={subcategory.id} rounded="lg">
                    <HStack>
                      <Text flexGrow={1}>{subcategory.name}</Text>

                      <IconButton
                        as={Link}
                        to={subcategory.id}
                        aria-label="Edit"
                        icon={<BsPencilSquare />}
                        variant="outline"
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<IoMdTrash />}
                        variant="outline"
                        onClick={() => onDelete(subcategory)}
                      />
                    </HStack>
                  </ListItem>
                );
              })}
            </List>
          </DrawerBody>
          <DrawerFooter>
            <Button
              as={Link}
              to={`new?${params.toString()}`}
              colorScheme="brand"
              size="md"
            >
              New Subcategory
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {selectedAccountSubcategory && selectedAccountSubcategory.id && (
        <ConfirmDelete
          isOpen={deleteModal.isOpen}
          action={path.to.deleteAccountingSubcategory(
            selectedAccountSubcategory.id
          )}
          name={selectedAccountSubcategory?.name ?? ""}
          text={`Are you sure you want to deactivate the ${selectedAccountSubcategory?.name} subcategory?`}
          onCancel={onDeleteCancel}
        />
      )}
    </>
  );
};

export default AccountCategoryDetail;
