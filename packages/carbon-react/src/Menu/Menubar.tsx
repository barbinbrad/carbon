import type {
  ButtonProps,
  MenuButtonProps,
  StackProps,
} from "@chakra-ui/react";
import { Button, HStack, MenuButton } from "@chakra-ui/react";
import { forwardRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { useColor } from "../hooks";

const Menubar = forwardRef<HTMLDivElement, StackProps>(
  ({ children, ...props }, ref) => {
    const borderColor = useColor("gray.200");
    return (
      <HStack
        ref={ref}
        {...props}
        alignItems="center"
        bg="white"
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="md"
        boxShadow="sm"
        justifyContent="start"
        p={1}
        spacing={1}
        w="full"
      >
        {children}
      </HStack>
    );
  }
);
Menubar.displayName = "Menubar";

const MenubarTrigger = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <MenuButton
        ref={ref}
        as={Button}
        size="sm"
        variant="ghost"
        rightIcon={<MdExpandMore />}
        {...props}
      >
        {children}
      </MenuButton>
    );
  }
);
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarItem = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button ref={ref} size="sm" variant="ghost" {...props}>
        {children}
      </Button>
    );
  }
);
MenubarItem.displayName = "MenubarItem";

export { Menubar, MenubarItem, MenubarTrigger };
