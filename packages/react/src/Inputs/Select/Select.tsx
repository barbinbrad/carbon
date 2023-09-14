/* eslint-disable react/display-name */
import { forwardRef, useId } from "react";
import type { MutableRefObject, ReactElement, RefAttributes } from "react";
import ReactSelect from "react-select";
import type { GroupBase, Props, SelectInstance } from "react-select";
import useSelectProps from "./useSelect";

export type SelectComponent = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>
) => ReactElement;

const Select = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: Props<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null
  ) => {
    const instanceId = useId();
    const selectProps = useSelectProps(props);

    return <ReactSelect instanceId={instanceId} ref={ref} {...selectProps} />;
  }
) as SelectComponent;

export default Select;
