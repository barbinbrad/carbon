import { BsClock, BsFolder, BsFolderPlus, BsStar } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import type { Route } from "~/types";

const documentsRoutes: Route[] = [
  {
    name: "All Documents",
    to: "/x/documents/search",
    icon: <BsFolder />,
  },
  {
    name: "My Documents",
    to: "/x/documents/my",
    icon: <BsFolderPlus />,
  },
  {
    name: "Recent",
    to: "/x/documents/recent",
    icon: <BsClock />,
  },
  {
    name: "Starred",
    to: "/x/documents/starred",
    icon: <BsStar />,
  },
  {
    name: "Trash",
    to: "/x/documents/trash",
    icon: <IoMdTrash />,
  },
];

export default function useDocumentsSidebar() {
  return { links: documentsRoutes };
}
