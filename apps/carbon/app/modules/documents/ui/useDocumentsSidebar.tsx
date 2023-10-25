import { BsClock, BsFolder, BsFolderPlus, BsStar } from "react-icons/bs";
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
    name: "Starred",
    to: path.to.documents,
    q: "starred",
    icon: <BsStar />,
  },
  {
    name: "Trash",
    to: path.to.documents,
    q: "trash",
    icon: <IoMdTrash />,
  },
];

export default function useDocumentsSidebar() {
  return { links: documentsRoutes };
}
