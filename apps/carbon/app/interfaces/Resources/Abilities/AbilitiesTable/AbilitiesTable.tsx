import { ActionMenu } from "@carbon/react";
import { AvatarGroup, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { ParentSize } from "@visx/responsive";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar } from "~/components";
import { Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { Ability, AbilityDatum } from "~/interfaces/Resources/types";
import AbilityChart from "../AbilityChart";

type AbilitiesTableProps = {
  data: Ability[];
  count: number;
};

const AbilitiesTable = memo(({ data, count }: AbilitiesTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.id,
    name: row.name,
    // @ts-ignore
    weeks: row.curve?.data.at(-1).week,
    curve: row.curve as { data: AbilityDatum[] },
    employees: Array.isArray(row.employeeAbility)
      ? row.employeeAbility.reduce<
          { name: string; avatarUrl: string | null }[]
        >((acc, curr) => {
          if (curr.user) {
            if (Array.isArray(curr.user)) {
              curr.user.forEach((user) => {
                acc.push({
                  name: user.fullName ?? "",
                  avatarUrl: user.avatarUrl,
                });
              });
            } else {
              acc.push({
                name: curr.user.fullName ?? "",
                avatarUrl: curr.user.avatarUrl,
              });
            }
          }
          return acc;
        }, [])
      : row.employeeAbility?.user && Array.isArray(row.employeeAbility?.user)
      ? row.employeeAbility.user.map((user) => ({
          name: user.fullName ?? "",
          avatarUrl: user.avatarUrl,
        }))
      : [],
  }));

  return (
    <Table<typeof rows[number]>
      data={rows}
      count={count}
      columns={[
        {
          accessorKey: "name",
          header: "Ability",
          cell: (item) => item.getValue(),
        },
        {
          header: "Employees",
          // accessorKey: undefined, // makes the column unsortable
          cell: ({ row }) => (
            <AvatarGroup max={5} size="sm" spacing={-2}>
              {row.original.employees.map((employee, index: number) => (
                <Avatar
                  key={index}
                  name={employee.name ?? undefined}
                  title={employee.name ?? undefined}
                  path={employee.avatarUrl}
                />
              ))}
            </AvatarGroup>
          ),
        },
        {
          header: "Time to Learn",
          cell: ({ row }) => `${row.original.weeks} weeks`,
        },
        {
          header: "Efficiency Curve",
          size: 200,
          cell: ({ row }) => (
            <AbilityChart
              parentHeight={33}
              parentWidth={200}
              data={row.original.curve.data}
              margin={{ top: 0, right: 0, bottom: 0, left: 2 }}
            />
          ),
        },
        {
          accessorKey: "id",
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          cell: ({ row }) => (
            <Flex justifyContent="end">
              <ActionMenu>
                <MenuItem
                  icon={<BsPencilSquare />}
                  onClick={() => {
                    navigate(`/x/resources/ability/${row.original.id}`);
                  }}
                >
                  Edit Ability
                </MenuItem>
                <MenuItem
                  isDisabled={!permissions.can("delete", "resources")}
                  icon={<IoMdTrash />}
                  onClick={() => {
                    navigate(`/x/resources/ability/delete/${row.original.id}`);
                  }}
                >
                  Delete Ability
                </MenuItem>
              </ActionMenu>
            </Flex>
          ),
        },
      ]}
      onRowClick={(row) => {
        navigate(`/x/resources/ability/${row.id}`);
      }}
    />
  );
});

AbilitiesTable.displayName = "AbilitiesTable";
export default AbilitiesTable;
