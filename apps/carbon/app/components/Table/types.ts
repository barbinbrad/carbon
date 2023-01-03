export interface TableAction<T> {
  label: string;
  onClick: (rows: T[]) => void;
  disabled?: boolean;
  icon?: JSX.Element;
}
