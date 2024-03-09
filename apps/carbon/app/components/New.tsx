import {
  Button,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useKeyboardShortcuts,
} from "@carbon/react";
import { Link } from "@remix-run/react";
import { useRef } from "react";
import { IoMdAdd } from "react-icons/io";

type NewProps = {
  label?: string;
  to: string;
};

const New = ({ label, to }: NewProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useKeyboardShortcuts({
    n: (event: KeyboardEvent) => {
      event.stopPropagation();
      buttonRef.current?.click();
    },
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button asChild leftIcon={<IoMdAdd />} ref={buttonRef}>
            <Link to={to}>New {label}</Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <HStack>N</HStack>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default New;
