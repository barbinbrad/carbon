import type { ButtonProps } from "@chakra-ui/react";
import { Button, Input, InputGroup } from "@chakra-ui/react";
import type { ChangeEvent, PropsWithChildren } from "react";
import { useRef } from "react";

type FileProps = PropsWithChildren<
  Omit<ButtonProps, "onChange"> & {
    accept?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  }
>;

const File = ({ accept, children, onChange, ...props }: FileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <InputGroup w="auto">
      <Input
        ref={fileInputRef}
        type="file"
        hidden
        accept={accept}
        onChange={onChange}
      />
      <Button
        variant="solid"
        colorScheme="brand"
        {...props}
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.click();
        }}
      >
        {children}
      </Button>
    </InputGroup>
  );
};

export default File;
