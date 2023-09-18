import type { MutableRefObject, ReactElement, RefAttributes } from "react";
import { forwardRef } from "react";
import type { GroupBase, SelectInstance } from "react-select";
import type { CreatableProps } from "react-select/creatable";
import CreatableReactSelect from "react-select/creatable";
import useChakraSelectProps from "../use-chakra-select-props";

export type CreatableSelectComponent = <
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: CreatableProps<Option, IsMulti, Group> &
    RefAttributes<SelectInstance<Option, IsMulti, Group>>
) => ReactElement;

// eslint-disable-next-line react/display-name
const CreatableSelect = forwardRef(
  <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
    props: CreatableProps<Option, IsMulti, Group>,
    ref:
      | ((instance: SelectInstance<Option, IsMulti, Group> | null) => void)
      | MutableRefObject<SelectInstance<Option, IsMulti, Group> | null>
      | null
  ) => {
    const chakraSelectProps = useChakraSelectProps(props);

    return <CreatableReactSelect ref={ref} {...chakraSelectProps} />;
  }
) as CreatableSelectComponent;

export default CreatableSelect;
