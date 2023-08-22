import { Badge, HStack, MenuItem, Progress } from "@chakra-ui/react";
import { useNavigate, useParams } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar, Table } from "~/components";
import { usePermissions } from "~/hooks";
import { AbilityEmployeeStatus } from "~/modules/resources";
import type { AbilityEmployees } from "~/modules/resources";

type AbilityEmployeeTableProps = {
  employees: AbilityEmployees;
  weeks: number;
  shadowWeeks: number;
};

const AbilityEmployeesTable = ({
  employees,
  weeks,
}: AbilityEmployeeTableProps) => {
  const { abilityId } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = useMemo(
    () =>
      Array.isArray(employees)
        ? employees
            .filter((employee) => {
              // @ts-ignore
              return employee.user?.active === true;
            })
            .map((employee) => {
              if (Array.isArray(employee.user)) {
                throw new Error("AbilityEmployeesTable: user is an array");
              }

              return {
                id: employee.id,
                name: employee.user?.fullName ?? "",
                avatarUrl: employee.user?.avatarUrl ?? null,
                status: employee.trainingCompleted
                  ? AbilityEmployeeStatus.Complete
                  : employee.trainingDays
                  ? AbilityEmployeeStatus.InProgress
                  : AbilityEmployeeStatus.NotStarted,
                percentage: (employee.trainingDays / 5 / weeks) * 100,
              };
            })
        : [],
    [employees, weeks]
  );

  const columns = useMemo<ColumnDef<(typeof rows)[number]>[]>(() => {
    return [
      {
        // accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <HStack spacing={2}>
            <Avatar
              size="sm"
              // @ts-ignore
              name={row.original.name}
              // @ts-ignore
              path={row.original.avatarUrl}
            />

            <span>{row.original.name}</span>
          </HStack>
        ),
      },
      {
        header: "Training Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              size="sm"
              variant={
                status === AbilityEmployeeStatus.Complete
                  ? undefined
                  : "outline"
              }
              colorScheme={
                status === AbilityEmployeeStatus.Complete
                  ? "green"
                  : status === AbilityEmployeeStatus.InProgress
                  ? "yellow"
                  : "gray"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        header: "Training Progress",
        width: 200,
        cell: ({ row }) => {
          const percentage = row.original.percentage;
          return (
            <Progress
              size="md"
              borderRadius="full"
              maxW={200}
              colorScheme="green"
              value={
                row.original.status === AbilityEmployeeStatus.Complete
                  ? 100
                  : percentage
              }
            />
          );
        },
      },
    ];
  }, []);

  const renderContextMenu = useCallback(
    (row: (typeof rows)[number]) => {
      return (
        <>
          <MenuItem
            isDisabled={!permissions.can("update", "resources")}
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/resources/ability/${abilityId}/employee/${row.id}`);
            }}
          >
            Edit Employee Ability
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/resources/ability/${abilityId}/employee/delete/${row.id}`
              );
            }}
          >
            Delete Employee Ability
          </MenuItem>
        </>
      );
    },
    [abilityId, navigate, permissions]
  );

  if (!abilityId) return null;
  return (
    <Table<(typeof rows)[number]>
      data={rows}
      count={rows.length}
      columns={columns}
      renderContextMenu={renderContextMenu}
      withPagination={false}
    />
  );
};

export default AbilityEmployeesTable;
