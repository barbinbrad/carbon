/**
 * Welcome to UserSelect
 *
 * Controlled, accessible, multi-user select component for groups and people.
 *
 * A combobox is the combination of an `<input type="text"/>` and a list. In
 * this case, the list conforms to the `treeselect` pattern.
 *
 * @see WAI-ARIA Comobox https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * @see WAI-ARIA Tree View https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */

import { FormLabel } from "@chakra-ui/react";
import Combobox from "./components/Combobox";
import Container from "./components/Container";
import Input from "./components/Input";
import Popover from "./components/Popover";
import SelectionList from "./components/SelectionList";
import TreeSelect from "./components/TreeSelect";
import UserSelectionModal from "./components/Modal";
import type { UserSelectProps } from "./types";
import { UserSelectContext } from "./provider";
import useUserSelect from "./useUserSelect";

export default function Component(props: UserSelectProps) {
  const state = useUserSelect(props);
  return <UserSelect {...state} />;
}

const UserSelect = (state: ReturnType<typeof useUserSelect>) => {
  const {
    modal,
    dropdown,
    innerProps: {
      hideSelections,
      isMulti,
      label,
      modalOnly,
      readOnly,
      testID,
      width,
    },
    refs: { containerRef },
    selectionItemsById,
  } = state;

  return (
    <UserSelectContext.Provider value={state}>
      {label && <FormLabel>{label}</FormLabel>}
      {!modalOnly && (
        <>
          <Container ref={containerRef} width={width} testID={testID}>
            {!readOnly && (
              <Combobox>
                <Input />
                {dropdown.isOpen && (
                  <Popover>
                    <TreeSelect />
                  </Popover>
                )}
              </Combobox>
            )}
            {!hideSelections &&
              isMulti &&
              Object.keys(selectionItemsById).length > 0 && <SelectionList />}
          </Container>
        </>
      )}
      {modal.isOpen && <UserSelectionModal />}
    </UserSelectContext.Provider>
  );
};
