import {
  Button,
  Count,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VStack,
  useKeyboardShortcuts,
} from "@carbon/react";
import { prettifyKeyboardShortcut } from "@carbon/utils";
import { Link, useMatches, useNavigate } from "@remix-run/react";
import type { IconType } from "react-icons";

type DetailSidebarProps = {
  links: {
    name: string;
    to: string;
    icon?: IconType;
    count?: number;
    shortcut?: string;
  }[];
};

const DetailSidebar = ({ links }: DetailSidebarProps) => {
  const matches = useMatches();
  const navigate = useNavigate();

  useKeyboardShortcuts(
    links.reduce<Record<string, () => void>>((acc, link) => {
      if (link.shortcut) {
        acc[link.shortcut] = () => navigate(link.to);
      }
      return acc;
    }, {})
  );

  return (
    <TooltipProvider>
      <VStack className="overflow-y-auto h-full" spacing={1}>
        {links.map((route) => {
          const isActive = matches.some(
            (match) =>
              (match.pathname.includes(route.to) && route.to !== "") ||
              (match.id.includes(".index") && route.to === "")
          );

          return (
            <Tooltip key={route.name}>
              <TooltipTrigger className="w-full">
                <Button
                  asChild
                  variant={isActive ? "primary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to={route.to}>
                    {route.icon && <route.icon className="mr-2" />}
                    <span>{route.name}</span>
                    {route.count !== undefined && (
                      <Count count={route.count} className="ml-auto" />
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              {route.shortcut && (
                <TooltipContent side="right">
                  <HStack>{prettifyKeyboardShortcut(route.shortcut)}</HStack>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </VStack>
    </TooltipProvider>
  );
};

export default DetailSidebar;
