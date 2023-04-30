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

const iconSize = {
  h: 6,
  w: 6,
};

const DocumentIcon = ({ fileName }: DocumentIconProps) => {
  const fileExtension = [...fileName.split(".")].pop();

  switch (fileExtension) {
    case "doc":
    case "docx":
      return <Icon color="blue.500" {...iconSize} as={BsFileWordFill} />;
    case "xls":
    case "xlsx":
      return <Icon color="green.700" {...iconSize} as={BsFileExcelFill} />;
    case "ppt":
    case "pptx":
      return <Icon color="orange.400" {...iconSize} as={BsFilePptFill} />;
    case "pdf":
      return <Icon color="red.600" {...iconSize} as={BsFilePdfFill} />;
    case "zip":
    case "rar":
      return <Icon {...iconSize} as={BsFileZipFill} />;
    case "txt":
      return <Icon {...iconSize} as={BsFileTextFill} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <Icon color="yellow.400" {...iconSize} as={BsFileImageFill} />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "flv":
    case "mkv":
      return (
        <Icon color="purple.500" {...iconSize} as={BsFileEarmarkPlayFill} />
      );
    case "mp3":
    case "wav":
    case "wma":
    case "aac":
    case "ogg":
    case "m4a":
      return <Icon color="cyan.400" {...iconSize} as={BsFileEarmarkPlayFill} />;
    default:
      return <Icon {...iconSize} as={BsFileEarmarkFill} />;
  }
};

export default DocumentIcon;
