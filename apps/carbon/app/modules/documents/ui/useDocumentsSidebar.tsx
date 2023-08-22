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
    q: "my",
    icon: <BsFolderPlus />,
  },
  {
    name: "Recent",
    to: "/x/documents/search",
    q: "recent",
    icon: <BsClock />,
  },
  {
    name: "Starred",
    to: "/x/documents/search",
    q: "starred",
    icon: <BsStar />,
  },
  {
    name: "Trash",
    to: "/x/documents/search",
    q: "trash",
    icon: <IoMdTrash />,
  },
];

export default function useDocumentsSidebar() {
  return { links: documentsRoutes };
}
