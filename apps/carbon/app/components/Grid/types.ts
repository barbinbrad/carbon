export type EditableTableCellComponent<TData> = (props: {
  accessorKey: string;
  row: TData;
  value: unknown;
  onUpdate: (value: unknown) => void;
  onError: () => void;
}) => JSX.Element;

export type EditableTableCellComponentProps<T> = {
  value: unknown;
  row: T;
  accessorKey: string;
  onUpdate: (value: unknown) => void;
  onError: () => void;
};

export type Position = null | { row: number; column: number };
