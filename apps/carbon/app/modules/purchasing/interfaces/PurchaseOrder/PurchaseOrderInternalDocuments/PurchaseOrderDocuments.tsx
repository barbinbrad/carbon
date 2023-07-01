import { convertKbToString } from "@carbon/utils";
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { MdMoreVert } from "react-icons/md";
import { DocumentIcon } from "~/modules/documents";
import type { PurchaseOrderAttachment } from "~/modules/purchasing";
import { PurchaseOrderDocumentForm } from "~/modules/purchasing";
import { usePurchaseOrderDocuments } from "./usePurchaseOrderDocuments";

type PurchaseOrderDocumentsProps = {
  attachments: PurchaseOrderAttachment[];
  isExternal: boolean;
  orderId: string;
};

const PurchaseOrderDocuments = ({
  attachments,
  isExternal,
  orderId,
}: PurchaseOrderDocumentsProps) => {
  const { canDelete, download, deleteAttachment } = usePurchaseOrderDocuments({
    isExternal,
    orderId,
  });

  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            {isExternal ? "External" : "Internal"} Attachments
          </Heading>
          <PurchaseOrderDocumentForm
            isExternal={isExternal}
            orderId={orderId}
          />
        </CardHeader>
        <CardBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Size</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {attachments.length ? (
                attachments.map((attachment) => (
                  <Tr key={attachment.id}>
                    <Td>
                      <HStack>
                        <DocumentIcon fileName={attachment.name} />
                        <Link onClick={() => download(attachment)}>
                          {attachment.name}
                        </Link>
                      </HStack>
                    </Td>
                    <Td>
                      {convertKbToString(
                        Math.floor((attachment.metadata?.size ?? 0) / 1024)
                      )}
                    </Td>
                    <Td>
                      <Flex w="full" justifyContent="flex-end">
                        <Menu>
                          <MenuButton
                            aria-label="More"
                            as={IconButton}
                            icon={<MdMoreVert />}
                            variant="outline"
                          />
                          <MenuList>
                            <MenuItem onClick={() => download(attachment)}>
                              Download
                            </MenuItem>
                            <MenuItem
                              isDisabled={!canDelete}
                              onClick={() => deleteAttachment(attachment)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={24} py={8} color="gray.500" textAlign="center">
                    No {isExternal ? "external" : "internal"} attachments
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderDocuments;
