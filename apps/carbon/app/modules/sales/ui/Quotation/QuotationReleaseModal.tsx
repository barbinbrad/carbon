import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  VStack,
} from "@carbon/react";
import { ValidatedForm } from "@carbon/remix-validated-form";
import { useParams } from "@remix-run/react";
import { useState } from "react";
import { CustomerContact, SelectControlled } from "~/components/Form";
import { useIntegrations } from "~/hooks/useIntegrations";
import { path } from "~/utils/path";
import { quotationReleaseValidator } from "../../sales.models";
import type { Quotation } from "../../types";

type QuotationReleaseModalProps = {
  onClose: () => void;
  quotation?: Quotation;
};

const QuotationReleaseModal = ({
  quotation,
  onClose,
}: QuotationReleaseModalProps) => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const integrations = useIntegrations();
  const canEmail = integrations.has("resend");

  const [notificationType, setNotificationType] = useState(
    canEmail ? "Email" : "Download"
  );

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ValidatedForm
          method="post"
          validator={quotationReleaseValidator}
          action={path.to.quoteRelease(id)}
          onSubmit={onClose}
          defaultValues={{
            notification: notificationType as "Email" | "None",
            customerContact: quotation?.customerContactId ?? undefined,
          }}
        >
          <ModalHeader>
            <ModalTitle>{`Release ${quotation?.quoteId}`}</ModalTitle>
            <ModalDescription>
              Are you sure you want to release the quote?
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              {canEmail && (
                <SelectControlled
                  label="Send Via"
                  name="notification"
                  options={[
                    {
                      label: "None",
                      value: "None",
                    },
                    {
                      label: "Email",
                      value: "Email",
                    },
                  ]}
                  value={notificationType}
                  onChange={(t) => {
                    if (t) setNotificationType(t.value);
                  }}
                />
              )}
              {notificationType === "Email" && (
                <CustomerContact
                  name="customerContact"
                  customer={quotation?.customerId ?? undefined}
                />
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Release</Button>
          </ModalFooter>
        </ValidatedForm>
      </ModalContent>
    </Modal>
  );
};

export default QuotationReleaseModal;
