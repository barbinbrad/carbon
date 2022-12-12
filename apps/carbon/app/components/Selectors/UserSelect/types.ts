import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
} from "react";

export type ComboBoxRefs = {
  containerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  listBoxRef: RefObject<HTMLUListElement>;
  popoverRef: RefObject<HTMLDivElement>;
  buttonRef: RefObject<Element>;
  focusableNodes: MutableRefObject<Record<string, TreeNode>>;
};

export type TreeNode = {
  uid: string;
  expandable: boolean;
  parentId?: string;
  previousId?: string;
  nextId?: string;
};
export interface UserSelectProps {
  accessibilityLabel?: string;
  canSwitchTeams?: boolean;
  checkedSelections?: boolean;
  disabled?: boolean;
  hideSelections?: boolean;
  id?: string;
  individualsOnly?: boolean;
  innerInputRender?:
    | ((props: UserSelectProps) => JSX.Element | JSX.Element[])
    | ReactNode
    | null;
  isModalOpen?: boolean;
  isMulti?: boolean;
  label?: string;
  modalOnly?: boolean;
  placeholder?: string;
  showAvatars?: boolean;
  queryFilters?: UserSelectionQueryFilters;
  readOnly?: boolean;
  renderInput?: ReactNode;
  resetAfterSelection?: boolean;
  selections?: SelectionItemInterface[];
  selectionsMaxHeight?: string | number;
  testID?: string;
  usersOnly?: boolean;
  employeeTypesOnly?: boolean;
  value?: string[] | string; // Will be set when used as a controlled input
  width?: number;
  onBlur?: (e: any) => void;
  onCancel?: () => void;
  onChange?: (selectionsList: SelectionItemInterface[]) => void;
  onCheckedSelectionsChange?: (
    checkedSelectionsList: SelectionItemInterface[]
  ) => void;
}

export type OptionGroup = {
  uid: string;
  expanded: boolean;
  items: SelectionItemInterface[];
  label: string;
};

export interface PersonNode {
  id?: string;
  label: string;
  selectionId: string;
  initials: string;
  orgId?: number;
  preferredName?: string;
  personId?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  active?: boolean;
  pictureUrl: string | null;
  teamLabels?: string;
  __typename?: "PersonNode";
}

export interface PopoverProps {
  aria: HTMLAttributes<HTMLDivElement>;
  children: ReactNode;
  innerProps: UserSelectProps;
  refs: ComboBoxRefs;
}

export interface SelectionGroup {
  id?: string;
  label: string;
  selectionId: string;
  people: PersonNode[];
  pluralLabel: string;
  groupType: string;
  active?: boolean;
  team?: {
    label?: string;
  };
  __typename?: "SelectionGroup";
}

interface SelectionOptions {
  uid?: string;
  isChecked?: boolean;
  isPersistent?: boolean; // does not prevent removal from the item within the modal.
  sortString?: string;
}

type PersonNodeWithOptions = PersonNode & SelectionOptions;
type SelectionGroupWithOptions = SelectionGroup & SelectionOptions;

export type SelectionItemInterface =
  | PersonNodeWithOptions
  | SelectionGroupWithOptions;

export interface SingleUserselectProps {
  disabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
}

export type SelectionItemsById = Record<string, SelectionItemInterface>;

export interface SelectInputProps {
  aria?: Omit<InputHTMLAttributes<HTMLInputElement>, "size">;
  errors?: unknown; // TODO
  inputValue: string;
  innerProps: UserSelectProps | SingleUserselectProps;
  isModalOpen: boolean;
  loading: boolean;
  isMulti: boolean;
  refs: ComboBoxRefs;
  onMoreButtonClick: () => void;
  onClearSearchInput: () => void;
  onInputOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onInputBlur: () => void;
  onInputFocus: () => void;
}

export interface UserTreeSelectProps {
  aria: HTMLAttributes<HTMLUListElement>;
  disabledSelections?: string[];
  focusedId: string | null;
  groups: OptionGroup[];
  groupTypeFilter?: string;
  innerProps: UserSelectProps;
  instanceId: string;
  itemOnSelect?: (selectableItem: SelectionItemInterface) => void;
  itemOnStage?: (selectableItem: SelectionItemInterface) => void;
  loading: boolean;
  multi?: boolean;
  refs: ComboBoxRefs;
  searchFilter?: string;
  selectionItemsById: SelectionItemsById;
  stagedSelectionsById?: SelectionItemsById;
  visible?: boolean;
}

export interface UserSelectionQueryFilters {
  excludeAthletes?: boolean;
  excludeSelf?: boolean;
  includeContacts?: boolean;
  includeEveryoneGroups?: boolean;
  onlyPersonTypes?: string[];
  selectionRestrictingPermission?: string;
  allowedPeople?: number[];
}
