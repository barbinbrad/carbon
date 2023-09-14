// MIT License

// Copyright (c) 2022 Lukas Bach

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import type { PortalProps, MenuButtonProps, MenuProps } from "@chakra-ui/react";
import { useEventListener, Portal, Menu, MenuButton } from "@chakra-ui/react";
import type { ReactNode, MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/* 
 * ContextMenu - A context menu that opens on right click
 * Example usage:

<ContextMenu<HTMLDivElement>
  renderMenu={() => (
    <MenuList>
      <MenuGroup title="Profile">
        <MenuItem>My Account</MenuItem>
        <MenuItem>Payments </MenuItem>
      </MenuGroup>
      <MenuDivider />
      <MenuGroup title="Help">
        <MenuItem>Docs</MenuItem>
        <MenuItem>FAQ</MenuItem>
      </MenuGroup>
    </MenuList>
  )}
>
  {(ref) => <div ref={ref}>Target</div>}
</ContextMenu>
*/

export interface ContextMenuProps<T extends HTMLElement> {
  renderMenu: () => JSX.Element | null;
  children: (ref: MutableRefObject<T | null>) => JSX.Element | null;
  menuProps?: Omit<MenuProps, "children"> & { children?: ReactNode };
  portalProps?: Omit<PortalProps, "children"> & { children?: ReactNode };
  menuButtonProps?: MenuButtonProps;
}

export default function ContextMenu<T extends HTMLElement = HTMLElement>({
  renderMenu,
  children,
  menuProps,
  portalProps,
  menuButtonProps,
}: ContextMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isDeferredOpen, setIsDeferredOpen] = useState(false);
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsRendered(true);
        setTimeout(() => {
          setIsDeferredOpen(true);
        });
      });
    } else {
      setIsDeferredOpen(false);
      const timeout = setTimeout(() => {
        setIsRendered(isOpen);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEventListener("contextmenu", (e) => {
    if (
      targetRef.current?.contains(e.target as any) ||
      e.target === targetRef.current
    ) {
      e.preventDefault();
      setIsOpen(true);
      setPosition([e.pageX, e.pageY]);
    } else {
      setIsOpen(false);
    }
  });

  const onCloseHandler = useCallback(() => {
    menuProps?.onClose?.();
    setIsOpen(false);
  }, [menuProps, setIsOpen]);

  return (
    <>
      {children(targetRef)}
      {isRendered && (
        <Portal {...portalProps}>
          <Menu
            isLazy
            isOpen={isDeferredOpen}
            gutter={0}
            {...menuProps}
            onClose={onCloseHandler}
          >
            <MenuButton
              aria-hidden={true}
              w={1}
              h={1}
              style={{
                position: "absolute",
                left: position[0],
                top: position[1],
                cursor: "default",
              }}
              {...menuButtonProps}
            />
            {renderMenu()}
          </Menu>
        </Portal>
      )}
    </>
  );
}
