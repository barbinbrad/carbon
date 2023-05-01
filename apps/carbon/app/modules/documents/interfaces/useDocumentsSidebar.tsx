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
    to: "/x/documents/search",
    filter: "my",
    icon: <BsFolderPlus />,
  },
  {
    name: "Recent",
    to: "/x/documents/search",
    filter: "recent",
    icon: <BsClock />,
  },
  {
    name: "Starred",
    to: "/x/documents/search",
    filter: "starred",
    icon: <BsStar />,
  },
  {
    name: "Trash",
    to: "/x/documents/search",
    filter: "trash",
    icon: <IoMdTrash />,
  },
];

export default function useDocumentsSidebar() {
  return { links: documentsRoutes };
}
