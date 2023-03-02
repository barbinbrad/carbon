import { Box } from "@chakra-ui/react";
import { sanitize } from "dompurify";
import { useEffect, useState } from "react";
import { reset } from "../Theme";

type HTMLProps = {
  text: string;
};

const HTML = ({ text }: HTMLProps) => {
  const [html, setHtml] = useState<string>("");
  const sanitizedHtml = { __html: html };

  useEffect(() => {
    setHtml(sanitize(text));
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
