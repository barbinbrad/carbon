import { Icon } from "@chakra-ui/react";
import {
  BsFileEarmarkFill,
  BsFileExcelFill,
  BsFileImageFill,
  BsFilePdfFill,
  BsFilePptFill,
  BsFileTextFill,
  BsFileWordFill,
  BsFileZipFill,
  BsFileEarmarkPlayFill,
} from "react-icons/bs";

type DocumentIconProps = {
  fileName: string;
};

const size = {
  h: 6,
  w: 6,
};

const DocumentIcon = ({ fileName }: DocumentIconProps) => {
  const fileExtension = [...fileName.split(".")].pop();

  switch (fileExtension) {
    case "doc":
    case "docx":
      return <Icon color="blue.500" {...size} as={BsFileWordFill} />;
    case "xls":
    case "xlsx":
      return <Icon color="green.700" {...size} as={BsFileExcelFill} />;
    case "ppt":
    case "pptx":
      return <Icon color="orange.400" {...size} as={BsFilePptFill} />;
    case "pdf":
      return <Icon color="red.600" {...size} as={BsFilePdfFill} />;
    case "zip":
    case "rar":
      return <Icon {...size} as={BsFileZipFill} />;
    case "txt":
      return <Icon {...size} as={BsFileTextFill} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <Icon color="yellow.400" {...size} as={BsFileImageFill} />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "mkv":
      return <Icon color="purple.500" {...size} as={BsFileEarmarkPlayFill} />;
    default:
      return <Icon {...size} as={BsFileEarmarkFill} />;
  }
};

export default DocumentIcon;
