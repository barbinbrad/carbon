import { useDebounce } from "@carbon/react";
import { Grid, IconButton, Input, ListItem, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { filterOperatorLabels } from "~/utils/query";

type FilterRowProps = {
  column: string;
  columnAccessors: Record<string, string>;
  operator: string;
  searchValue: string;
  onRemove: () => void;
  onUpdate: (newFilter: string) => void;
};

const FilterRow = ({
  column,
  columnAccessors,
  operator,
  searchValue,
  onRemove,
  onUpdate,
}: FilterRowProps) => {
  const [value, setValue] = useState(searchValue || "");
  const [debouncedQuery] = useDebounce(value, 500);

  useEffect(() => {
    const newFilter = `${column}:${operator}:${debouncedQuery}`;
    onUpdate(newFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const onColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = `${e.target.value}:${operator}:${searchValue}`;
    onUpdate(newFilter);
  };

  const onOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = `${column}:${e.target.value}:${searchValue}`;
    onUpdate(newFilter);
  };

  return (
    <ListItem>
      <Grid gridColumnGap={2} gridTemplateColumns="1fr 1fr 1fr auto">
        <Select size="sm" defaultValue={column} onChange={onColumnChange}>
          {Object.entries(columnAccessors).map(([accessor, title]) => (
            <option key={accessor} value={accessor}>
              {title}
            </option>
          ))}
        </Select>
        <Select size="sm" defaultValue={operator} onChange={onOperatorChange}>
          {filterOperatorLabels.map(({ operator, label }) => (
            <option key={operator} value={operator}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          defaultValue={searchValue}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
          placeholder="Enter a value"
        />
        <IconButton
          aria-label="Remove filter"
          icon={<IoMdClose />}
          onClick={onRemove}
          variant="ghost"
        />
      </Grid>
    </ListItem>
  );
};

export default FilterRow;
