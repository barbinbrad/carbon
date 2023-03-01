import { Box } from "@chakra-ui/react";
import { sanitize } from "dompurify";
import { useEffect, useState } from "react";

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
          "& h1": {
            fontSize: "2xl",
            fontWeight: "bold",
            letterSpacing: "tight",
          },
          "& h2": {
            fontSize: "xl",
            fontWeight: "bold",
            letterSpacing: "tight",
          },
          "& h3": {
            fontSize: "lg",
            fontWeight: "bold",
            letterSpacing: "tight",
          },
          "& ul, & ol": {
            ml: 4,
          },
          "& pre": {
            bg: "gray.100",
            p: 4,
            borderRadius: "md",
            overflow: "auto",
          },
          "& blockquote": {
            borderLeft: "4px solid",
            borderColor: "gray.200",
            pl: 4,
            ml: 4,
          },
          "& hr": {
            border: "none",
            borderBottom: "1px solid",
            borderColor: "gray.200",
            my: 4,
          },
        },
      }}
    >
      <span dangerouslySetInnerHTML={sanitizedHtml} />
    </Box>
  );
};

export default HTML;
