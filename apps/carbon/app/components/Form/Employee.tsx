import type { UserProps } from "./User";
import User from "./User";

export type EmployeesProps = UserProps;

const Employee = (props: EmployeesProps) => (
  <User {...props} usersOnly type="employee" />
);

export default Employee;
