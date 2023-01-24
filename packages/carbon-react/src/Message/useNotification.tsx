import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  chakra,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { UseToastOptions } from "@chakra-ui/react";
import { useMemo } from "react";
import { ClientOnly } from "../SSR";

const defaultOptions: UseToastOptions = {
  isClosable: true,
  position: "bottom-left",
};

export default function useNotification() {
  const toast = useToast();
  const variant = useColorModeValue("left-accent", "solid");

  const notify = useMemo(
    () => ({
      success: (message: string = "Success", options: UseToastOptions = {}) => {
        toast({
          ...defaultOptions,
          title: message,
          status: "success",
          variant,
          ...options,
        });
      },

      error: (message: string = "Error", options: UseToastOptions = {}) => {
        toast({
          ...defaultOptions,
          title: message,
          status: "error",
          variant,
          ...options,
        });
      },

      warning: (message: string = "Warning", options: UseToastOptions = {}) => {
        toast({
          ...defaultOptions,
          title: message,
          status: "warning",
          variant,
          ...options,
        });
      },

      info: (message: string = "Info", options: UseToastOptions = {}) => {
        toast({
          ...defaultOptions,
          title: message,
          status: "info",
          variant,
          ...options,
        });
      },

      copyableError: (
        error: any,
        message: string = "Error",
        context: Record<string, unknown> = {},
        options: UseToastOptions = {}
      ) => {
        toast({
          ...defaultOptions,
          render: (/*props: RenderProps*/) => {
            return (
              // do we need a ClientOnly component here?
              <ClientOnly
                fallback={<FakeCopyableErrorMessage message={message} />}
              >
                {() => (
                  <CopyableErrorMessage
                    message={message}
                    errorMessage={JSON.stringify({ error, context })}
                  />
                )}
              </ClientOnly>
            );
          },
          variant,
          ...options,
        });
      },
    }),
    [toast, variant]
  );

  return notify;
}

const FakeCopyableErrorMessage = ({ message }: { message: string }) => {
  return (
    <Alert
      addRole={false}
      status="error"
      variant={defaultOptions.variant}
      alignItems="start"
      borderRadius="md"
      boxShadow="lg"
      paddingEnd={8}
      textAlign="start"
      width="auto"
    >
      <AlertIcon />
      <chakra.div flex="1" maxWidth="100%">
        <AlertTitle>Error</AlertTitle>
        {message && (
          <AlertDescription display="block">{message}</AlertDescription>
        )}
      </chakra.div>
    </Alert>
  );
};

const CopyableErrorMessage = ({
  message,
  errorMessage,
}: {
  message: string;
  errorMessage: string;
}) => {
  const { hasCopied, onCopy } = useClipboard(errorMessage);

  return (
    <Alert
      addRole={false}
      onClick={onCopy}
      status="error"
      variant={defaultOptions.variant}
      alignItems="start"
      borderRadius="md"
      boxShadow="lg"
      cursor="pointer"
      paddingEnd={8}
      textAlign="start"
      width="auto"
    >
      <AlertIcon />
      <chakra.div flex="1" maxWidth="100%">
        <AlertTitle>Error</AlertTitle>
        {message && (
          <AlertDescription display="block">
            {hasCopied ? "Copied to Clipboard" : message}
          </AlertDescription>
        )}
      </chakra.div>
    </Alert>
  );
};
