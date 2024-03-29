import { BsClock, BsFolder, BsFolderPlus, BsPin } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import type { Route } from "~/types";
import { path } from "~/utils/path";

const documentsRoutes: Route[] = [
  {
    name: "All Documents",
    to: path.to.documents,
    icon: <BsFolder />,
  },
  {
    name: "My Documents",
    to: path.to.documents,
    q: "my",
    icon: <BsFolderPlus />,
  },
  {
    name: "Recent",
    to: path.to.documents,
    q: "recent",
    icon: <BsClock />,
  },
  {
    name: "Pinned",
    to: path.to.documents,
    q: "starred",
    icon: <BsPin />,
  },
  {
    name: "Trash",
    to: path.to.documents,
    q: "trash",
    icon: <IoMdTrash />,
  },
];

export default function useDocumentsSubmodules() {
  return { links: documentsRoutes };
}
