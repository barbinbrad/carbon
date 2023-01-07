export type EditableComponent<TData extends unknown> = (props: {
  accessorKey: string;
  row: TData;
  value: unknown;
  onUpdate: (value: unknown) => void;
}) => JSX.Element;

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    editableComponents?: Record<string, EditableComponent<TData>>;
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export type Position = null | { row: number; column: number };
export interface TableAction<T> {
  label: string;
  onClick: (rows: T[]) => void;
  disabled?: boolean;
  icon?: JSX.Element;
}
