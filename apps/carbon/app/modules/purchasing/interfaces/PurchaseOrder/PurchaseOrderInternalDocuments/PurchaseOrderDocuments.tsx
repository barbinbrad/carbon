import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import type { PurchaseOrderAttachment } from "~/modules/purchasing";
import { PurchaseOrderDocumentForm } from "~/modules/purchasing";

type PurchaseOrderDocumentsProps = {
  documents: PurchaseOrderAttachment[];
  orderId: string;
  isExternal: boolean;
};

const PurchaseOrderDocuments = ({
  documents,
  isExternal,
  orderId,
}: PurchaseOrderDocumentsProps) => {
  return (
    <>
      <Card w="full">
        <CardHeader display="flex" justifyContent="space-between">
          <Heading size="md" display="inline-flex">
            {isExternal ? "External" : "Internal"} Documents
          </Heading>
          <PurchaseOrderDocumentForm
            isExternal={isExternal}
            orderId={orderId}
          />
        </CardHeader>
        <CardBody>
          <pre>{JSON.stringify(documents, null, 2)}</pre>
        </CardBody>
      </Card>
      <Outlet />
    </>
  );
};

export default PurchaseOrderDocuments;
