import { useDisclosure, useOutsideClick, useId } from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import debounce from "lodash/debounce";
import words from "lodash/words";
import type {
  AriaAttributes,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import type {
  OptionGroup,
  SelectionItemsById,
  SelectionItemInterface,
  UserSelectionQueryFilters,
  UserSelectProps,
  TreeNode,
} from "./types";

const defaultProps = {
  accessibilityLabel: "User selector",
  canSwitchTeams: true,
  checkedSelections: false,
  disabled: false,
  hideSelections: false,
  id: "MultiUserSelect",
  individualsOnly: false,
  innerInputRender: null,
  isMulti: false,
  modalOnly: false,
  placeholder: "",
  queryFilters: {} as UserSelectionQueryFilters,
  readOnly: false,
  resetAfterSelection: true,
  selections: [] as SelectionItemInterface[],
  selectionsMaxHeight: "auto",
  showAvatars: false,
  testID: "UserSelect",
  usersOnly: false,
  employeeTypesOnly: false,
  onCancel: () => {},
};

export default function useUserSelect(props: UserSelectProps) {
  /* Inner Props */
  const innerProps = useMemo(
    () => ({
      ...defaultProps,
      ...props,
    }),
    [props]
  );

  /* Data Fetching */
  const groupsFetcher = useFetcher<{
    data?: unknown; //TODO
    errors?: unknown; // TODO
  }>();

  useEffect(() => {
    const params: Record<string, string> = {};
    const query = new URLSearchParams(params).toString();
    groupsFetcher.load(`/resource/groups?${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Refs */
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<Element>(null);
  const focusableNodes = useRef<Record<string, TreeNode>>({});
  const instanceId = useId();

  /* Disclosures */
  const dropdown = useDisclosure();
  const modal = useDisclosure({
    defaultIsOpen: innerProps.isModalOpen,
  });

  /* Input */
  const [controlledValue, setControlledValue] = useState("");

  /* Output */
  const [filteredOptionGroups, setFilteredOptionGroups] = useState<
    OptionGroup[]
  >([]);

  /* Focus */
  const [focusedId, setFocusedId] = useState<string | null>(null);

  /* Selections */
  const [selectionItemsById, setSelectionItemsById] =
    useState<SelectionItemsById>(
      innerProps.selections && innerProps.selections.length > 0
        ? makeSelectionItemsById(innerProps.selections, innerProps.isMulti)
        : {}
    );

  const optionGroups = useMemo<OptionGroup[]>(() => {
    // const makeGroupItems = (
    //   group: unknown, //TODO
    //   groupId: string
    // ): SelectionItemInterface[] => {
    //   const result: SelectionItemInterface[] = [];

    //   if (!innerProps.individualsOnly) {
    //     result.push({
    //       ...group,
    //       uid: getOptionId(groupId, group!.selectionCode!),
    //     } as SelectionItemInterface);
    //   }

    //   if (!innerProps.employeeTypesOnly && "people" in group && group.people) {
    //     const shouldFilterPeople =
    //       innerProps.queryFilters?.allowedPeople &&
    //       innerProps.queryFilters?.allowedPeople.length > 0;

    //     // while ugly, reduce allows us to filter allowed ids and map a new uid in one pass
    //     const people = group.people.reduce((acc, person) => {
    //       return !shouldFilterPeople ||
    //         (shouldFilterPeople &&
    //           innerProps.queryFilters?.allowedPeople?.includes(
    //             parseInt(utils.fromGlobalId(person!.id))
    //           ))
    //         ? acc.concat({
    //             ...person,
    //             uid: getOptionId(groupId, person!.selectionCode!),
    //           } as SelectionItemInterface)
    //         : acc;
    //     }, [] as SelectionItemInterface[]);
    //     return result.concat(people);
    //   }
    //   return result;
    // };

    // return !groupsFetcher.data ||
    //   !groupsFetcher.data.data ||
    //   !groupsFetcher.data.data.groups
    //   ? []
    //   : groupsFetcher.data.data.groups.map((group) => {
    //       const uid = getGroupId(instanceId, group!.selectionCode!);
    //       return {
    //         uid,
    //         expanded: false,
    //         items: makeGroupItems(group as SelectionGroup, uid),
    //         label: group?.label || "",
    //       };
    //     });

    console.log("groupsFetcher.data", groupsFetcher.data);
    return [];
  }, [
    groupsFetcher,
    instanceId,
    innerProps.individualsOnly,
    innerProps.employeeTypesOnly,
    innerProps.queryFilters?.allowedPeople,
  ]);

  /* Pre-populate controlled component after data loads */
  useEffect(() => {
    // if (innerProps.value && optionGroups && optionGroups.length > 0) {
    //   const flattened = optionGroups.reduce(
    //     (acc, group) => acc.concat(group.items),
    //     [] as SelectionItemInterface[]
    //   );
    //   if (Array.isArray(innerProps.value)) {
    //     const selections = flattened.reduce((acc, item) => {
    //       if (innerProps.value!.includes(item.selectionCode)) {
    //         return {
    //           ...acc,
    //           [item.selectionCode]: item,
    //         };
    //       }
    //       return acc;
    //     }, {} as SelectionItemsById);
    //     if (Object.keys(selections).length > 0) {
    //       setSelectionItemsById(selections);
    //     }
    //   } else {
    //     const selection = flattened.find(
    //       (item) => item.selectionCode === innerProps.value
    //     );
    //     if (selection) {
    //       setSelectionItemsById({
    //         [selection?.selectionCode]: selection,
    //       });
    //     }
    //   }
    // }
  }, [optionGroups, innerProps.value]);

  const makeFilteredOptionGroups = useCallback(
    (filter?: string): OptionGroup[] =>
      optionGroups.reduce((acc, group) => {
        if (filter?.trim()) {
          const matches = group.items.filter((item) =>
            searchTermStartsWordInString(item.label, filter)
          );
          if (matches && matches.length) {
            return acc.concat({
              ...group,
              expanded: true,
              items: matches,
            });
          } else {
            return acc;
          }
        } else {
          return acc.concat(group);
        }
      }, [] as OptionGroup[]),
    [optionGroups]
  );

  useEffect(() => {
    setFilteredOptionGroups(makeFilteredOptionGroups());
  }, [optionGroups, makeFilteredOptionGroups, setFilteredOptionGroups]);

  /* Event Handlers */

  const commit = useCallback(() => {
    dropdown.onClose();
    modal.onClose();
    setFocusedId(null);
  }, [dropdown, modal, setFocusedId]);

  useOutsideClick({
    ref: containerRef,
    handler: () => {
      clear();
      commit();
    },
  });

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const clear = useCallback(() => {
    setFilteredOptionGroups(makeFilteredOptionGroups());
    setControlledValue("");
  }, [makeFilteredOptionGroups, setControlledValue, setFilteredOptionGroups]);

  const resetFocus = useCallback(() => {
    setFocusedId(null);
    focusInput();
    if (listBoxRef) {
      listBoxRef.current?.scrollTo(0, 0);
    }
  }, [focusInput]);

  const onGroupExpand = useCallback(
    (uid: string) =>
      setFilteredOptionGroups((previousGroups) =>
        previousGroups.map((group) =>
          group.uid === uid ? { ...group, expanded: true } : group
        )
      ),
    [setFilteredOptionGroups]
  );

  const onGroupCollapse = useCallback(
    (uid: string) =>
      setFilteredOptionGroups((previousGroups) =>
        previousGroups.map((group) =>
          group.uid === uid ? { ...group, expanded: false } : group
        )
      ),
    [setFilteredOptionGroups]
  );

  const isExpanded = useCallback(
    (uid: string) =>
      filteredOptionGroups.some((g) => g.uid === uid && g.expanded),
    [filteredOptionGroups]
  );

  const getFirstNode = useCallback(() => {
    return Object.values(focusableNodes.current).find(
      (node) => node !== undefined && node.previousId === undefined
    );
  }, []);

  const getLastNode = useCallback(() => {
    return Object.values(focusableNodes.current).find(
      (node) => node !== undefined && node.nextId === undefined
    );
  }, []);

  const getNextNode = useCallback(
    (currentId: string | null) => {
      if (currentId === null) {
        if (!dropdown.isOpen) dropdown.onOpen();
        return getFirstNode();
      }

      const { nextId } = focusableNodes.current[currentId];
      if (nextId) {
        return focusableNodes.current[nextId];
      }
      resetFocus();
      return null;
    },
    [dropdown, getFirstNode, resetFocus]
  );

  const getPreviousNode = useCallback(
    (currentId: string | null) => {
      if (currentId === null) return getLastNode();

      const { previousId } = focusableNodes.current[currentId];
      if (previousId) {
        return focusableNodes.current[previousId];
      }
      resetFocus();
      return null;
    },
    [getLastNode, resetFocus]
  );

  const hasParent = useCallback(
    (id: string) => {
      const { parentId } = focusableNodes.current[id];
      return parentId !== undefined;
    },
    [focusableNodes]
  );

  const hasChildren = useCallback((id: string) => {
    return focusableNodes.current[id].expandable ?? false;
  }, []);

  const scrollTo = useCallback((elementId: string, delay: boolean) => {
    const element = document.getElementById(elementId);
    const block = "nearest";
    if (element) {
      if (delay) {
        setTimeout(() => {
          element.scrollIntoView({ block });
        }, 80);
      } else {
        element.scrollIntoView({ block });
      }
    }
  }, []);

  const getSelectionById = useCallback(
    (uid: string) => {
      for (const group of filteredOptionGroups) {
        const result = group.items.find((item) => item.uid === uid);
        if (result) return result;
      }

      return undefined;
    },
    [filteredOptionGroups]
  );

  const setFocus = useCallback(
    (command: string) => {
      let nextFocusedId = focusedId;
      let scrollDelay = false;
      switch (command) {
        case "first":
          nextFocusedId = getFirstNode()?.uid ?? null;
          break;
        case "last":
          nextFocusedId = getLastNode()?.uid ?? null;
          break;
        case "previous":
          nextFocusedId = getPreviousNode(focusedId)?.uid ?? null;
          break;
        case "next":
          nextFocusedId = getNextNode(focusedId)?.uid ?? null;
          break;
        default:
          nextFocusedId = command;
          scrollDelay = true;
      }

      setFocusedId(nextFocusedId);

      if (nextFocusedId) {
        const element = document.getElementById(nextFocusedId);
        if (element) element.focus();
        scrollTo(nextFocusedId, scrollDelay);
      }
    },
    [
      focusedId,
      getFirstNode,
      getLastNode,
      getPreviousNode,
      getNextNode,
      scrollTo,
      setFocusedId,
    ]
  );

  const debouncedInputChange = useMemo(() => {
    return debounce((search: string) => {
      setFilteredOptionGroups(makeFilteredOptionGroups(search));
      resetFocus();
    }, 240);
  }, [makeFilteredOptionGroups, resetFocus, setFilteredOptionGroups]);

  const onInputFocus = useCallback(() => {
    dropdown.onOpen();
    resetFocus();
  }, [dropdown, resetFocus]);

  const onInputBlur = useCallback(
    (e: any) => {
      if (innerProps.onBlur && typeof innerProps.onBlur === "function") {
        innerProps.onBlur(e);
      }
    },
    [innerProps]
  );

  const onMouseOver = useCallback(() => {
    setFocusedId(null);
  }, []);

  const onChange = useCallback(
    (selections: SelectionItemInterface[]) => {
      if (innerProps.onChange && typeof innerProps.onChange === "function") {
        innerProps.onChange(selections);
      }
    },
    [innerProps]
  );

  const onCheckedChange = useCallback(
    (selections: SelectionItemInterface[]) => {
      if (
        innerProps.onCheckedSelectionsChange &&
        typeof innerProps.onChange === "function"
      ) {
        innerProps.onCheckedSelectionsChange(selections);
      }
    },
    [innerProps]
  );

  const onSelect = useCallback(
    (selectionItem?: SelectionItemInterface) => {
      if (selectionItem === undefined) return;
      setSelectionItemsById((previousSelections) => {
        const nextSelections = innerProps.isMulti
          ? {
              ...previousSelections,
            }
          : {};

        nextSelections[selectionItem.selectionCode] = checked(selectionItem);

        onChange(Object.values(nextSelections));
        return nextSelections;
      });
      if (innerProps.isMulti) {
        setFocusedId(selectionItem.uid!);
      } else {
        commit();
        clear();
      }
    },
    [
      clear,
      commit,
      innerProps.isMulti,
      onChange,
      setFocusedId,
      setSelectionItemsById,
    ]
  );

  const onDeselect = useCallback(
    (selectionItem: SelectionItemInterface) => {
      if (selectionItem === undefined) return;
      const { selectionCode } = selectionItem;
      setSelectionItemsById((previousSelections) => {
        if (selectionCode in previousSelections) {
          const { [selectionCode]: removed, ...newSelectionCodes } =
            previousSelections;

          onChange(Object.values(newSelectionCodes));
          return newSelectionCodes;
        }

        return previousSelections;
      });
    },
    [onChange, setSelectionItemsById]
  );

  const onToggle = useCallback(
    (selectionItem?: SelectionItemInterface) => {
      if (selectionItem === undefined) return;
      if (selectionItem.selectionCode in selectionItemsById) {
        onDeselect(selectionItem);
      } else {
        onSelect(selectionItem);
      }
    },
    [onDeselect, onSelect, selectionItemsById]
  );

  const onToggleChecked = useCallback(
    (selectionItem?: SelectionItemInterface) => {
      if (selectionItem === undefined) return;
      setSelectionItemsById((previousSelections) => {
        const nextSelections = {
          ...previousSelections,
          [selectionItem.selectionCode]: toggleChecked(selectionItem),
        };

        onCheckedChange(Object.values(nextSelections));
        return nextSelections;
      });
    },
    []
  );

  const removeSelections = useCallback(() => {
    Object.values(selectionItemsById).forEach((item) => {
      onDeselect(item);
    });
  }, [onDeselect, selectionItemsById]);

  const onClearInput = useCallback(() => {
    clear();
    if (!innerProps.isMulti) {
      removeSelections();
    }
  }, [clear, innerProps.isMulti, removeSelections]);

  const onInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>): void => {
      setControlledValue(target.value);
      debouncedInputChange(target.value);

      if (target.value?.length > 0) {
        dropdown.onOpen();
      } else if (!innerProps.isMulti) {
        removeSelections();
      }
    },
    [
      debouncedInputChange,
      dropdown,
      innerProps.isMulti,
      removeSelections,
      setControlledValue,
    ]
  );

  const onExplode = useCallback(
    (selectionItem: SelectionItemInterface) => {
      if (!("people" in selectionItem)) return;

      const { selectionCode, people } = selectionItem;

      setSelectionItemsById((prevSelectionItems) => {
        if (selectionCode in prevSelectionItems) {
          const { [selectionCode]: removed, ...newSelectionItems } =
            prevSelectionItems;

          people.forEach((person) => {
            newSelectionItems[person.selectionCode] = person;
          });

          onChange(Object.values(newSelectionItems));
          return newSelectionItems;
        }

        return prevSelectionItems;
      });
    },
    [onChange, setSelectionItemsById]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (innerProps.disabled) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          if (focusedId) {
            if (hasParent(focusedId)) {
              const { parentId } = focusableNodes.current[focusedId];
              onGroupCollapse(parentId!);
              setFocus(parentId!);
            } else {
              onGroupCollapse(focusedId);
            }
            break;
          } else {
            return;
          }

        case "ArrowRight":
          if (focusedId && hasChildren(focusedId)) {
            if (isExpanded(focusedId)) {
              setFocus("next");
            } else {
              onGroupExpand(focusedId);
            }
            break;
          } else {
            return;
          }

        case "Tab":
          clear();
          commit();
          return;
        case "Enter":
          if (focusedId && hasParent(focusedId)) {
            onSelect(getSelectionById(focusedId));
            clear();
            commit();
            break;
          }
          break;
        case "Escape":
          if (dropdown.isOpen) {
            commit();
          } else {
            clear();
          }
          break;
        case " ": // space
          if (focusedId) {
            if (hasParent(focusedId)) {
              onToggle(getSelectionById(focusedId));
            }
            break;
          }
          return;
        case "ArrowUp":
          setFocus("previous");
          break;
        case "ArrowDown":
          if (dropdown.isOpen) {
            setFocus("next");
          } else {
            dropdown.onOpen();
          }
          break;
        case "Home":
          if (!dropdown.isOpen) return;
          setFocus("first");
          break;
        case "End":
          if (!dropdown.isOpen) return;
          setFocus("last");
          break;
        default:
          resetFocus();
          return;
      }
      event.preventDefault();
    },
    [
      commit,
      dropdown,
      focusedId,
      getSelectionById,
      hasParent,
      hasChildren,
      isExpanded,
      innerProps.disabled,
      clear,
      onGroupCollapse,
      onGroupExpand,
      onSelect,
      onToggle,
      resetFocus,
      setFocus,
    ]
  );

  const onShowModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    modal.onOpen();
    dropdown.onClose();
    setFocusedId(null);
    clear();
  };

  /* Accessibility */

  const popoverProps = useMemo<AriaAttributes>(() => ({}), []);

  const listBoxProps = useMemo<AriaAttributes & { id: string }>(
    () => ({
      id: instanceId,
      role: "tree",
      tabIndex: -1,
    }),
    [instanceId]
  );

  const inputProps = useMemo<AriaAttributes>(
    () => ({
      role: "combobox",
      "aria-expanded": dropdown.isOpen,
      "aria-controls": dropdown.isOpen ? instanceId : undefined,
      "aria-haspopup": "tree",
      "aria-autocomplete": "list",
      "aria-activedescendant": undefined, // TODO
      autoComplete: "off",
      autoCorrect: "off",
    }),
    [instanceId, dropdown.isOpen]
  );

  const aria = useMemo(
    () => ({
      inputProps,
      listBoxProps,
      popoverProps,
    }),
    [inputProps, listBoxProps, popoverProps]
  );

  let inputValue =
    innerProps.isMulti || focusedId || controlledValue
      ? controlledValue
      : Object.values(selectionItemsById)?.[0]?.label ?? "";

  return {
    aria,
    groups: filteredOptionGroups,
    errors: groupsFetcher.data?.errors,
    loading: groupsFetcher.state === "loading",
    selectionItemsById,
    // focus
    instanceId,
    focusedId,
    // filters
    inputValue,
    // disclosures
    modal,
    dropdown,
    // props
    innerProps,
    refs: {
      containerRef,
      inputRef,
      listBoxRef,
      popoverRef,
      buttonRef,
      focusableNodes,
    },
    // event handlers
    onClearInput,
    onKeyDown,
    onGroupCollapse,
    onGroupExpand,
    onInputChange,
    onInputBlur,
    onInputFocus,
    onSelect,
    onDeselect,
    onToggleChecked,
    onExplode,
    onMouseOver,
    onShowModal,
    setControlledValue,
    setSelectionItemsById,
  };
}

function getOptionId(groupId: string, optionId: string) {
  return `${groupId}_${optionId}_option`;
}

function getGroupId(instanceId: string, groupId: string) {
  return `${instanceId}_${groupId}_group`;
}

function checked(item: SelectionItemInterface): SelectionItemInterface {
  return {
    ...item,
    isChecked: true,
  };
}

function toggleChecked(item: SelectionItemInterface): SelectionItemInterface {
  return {
    ...item,
    isChecked: !item.isChecked || false,
  };
}

function makeSelectionItemsById(
  input: SelectionItemInterface[],
  isMulti: boolean
): SelectionItemsById {
  const result: SelectionItemsById = {};
  input.forEach((item) => {
    if (!(item.selectionCode in result)) {
      result[item.selectionCode] = checked(item);
      // early exit for signle user select
      if (!isMulti) return result;
    }
  });
  return result;
}

function searchTermStartsWordInString(string: string, searchTerm: string) {
  const stringLowerCase = string.toLocaleLowerCase().trim();
  const searchTermLowerCase = searchTerm.toLocaleLowerCase().trim();
  if (stringLowerCase.startsWith(searchTermLowerCase)) {
    return true;
  }
  const searchTermWords = words(searchTermLowerCase);
  const stringWords = words(stringLowerCase);
  return stringWords.some((stringWord) =>
    searchTermWords.some((searchTermWord) =>
      stringWord.startsWith(searchTermWord)
    )
  );
}
