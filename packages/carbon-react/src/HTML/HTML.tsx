import { Box } from "@chakra-ui/react";
import { sanitize } from "dompurify";
import { useMemo } from "react";
import { reset } from "../Theme";

type HTMLProps = {
  text: string;
};

const HTML = ({ text }: HTMLProps) => {
  const sanitizedHtml = useMemo(() => {
    return { __html: sanitize(text) };
  }, [text]);

  return (
    <Box
      __css={{
        "&": {
          ...reset,
        },
      }}
    >
      <span dangerouslySetInnerHTML={sanitizedHtml} />
    </Box>
  );
};

export default HTML;
