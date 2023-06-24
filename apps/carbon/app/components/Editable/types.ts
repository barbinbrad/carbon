export type EditableTableCellComponent<TData> = (props: {
  accessorKey: string;
  row: TData;
  value: unknown;
  onUpdate: (columnId: string, value: unknown) => void;
  onError: () => void;
}) => JSX.Element;

export type EditableTableCellComponentProps<T> = {
  value: unknown;
  row: T;
  accessorKey: string;
  onUpdate: (columnId: string, value: unknown, isValid?: boolean) => void;
  onError: () => void;
};

export type Position = null | { row: number; column: number };

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    editableComponents?: Record<string, EditableTableCellComponent<TData>>;
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
