import { ActionMenu } from "@carbon/react";
import {
  AvatarGroup,
  Badge,
  Flex,
  MenuItem,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Avatar } from "~/components";
import { Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Shift } from "~/interfaces/Resources/types";

type ShiftsTableProps = {
  data: Shift[];
  count: number;
};

const ShiftsTable = memo(({ data, count }: ShiftsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();

  const rows = data.map((row) => ({
    id: row.id,
    name: row.name,
    startTime: row.startTime,
    endTime: row.endTime,
    monday: row.monday,
    tuesday: row.tuesday,
    wednesday: row.wednesday,
    thursday: row.thursday,
    friday: row.friday,
    saturday: row.saturday,
    sunday: row.sunday,
    location: {
      name: Array.isArray(row.location)
        ? row.location[0].name
        : row.location?.name,
    },
    // TODO: extract this to a utils function - also used by AblitiesTable
    employees: Array.isArray(row.employeeShift)
      ? row.employeeShift.reduce<{ name: string; avatarUrl: string | null }[]>(
          (acc, curr) => {
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
          },
          []
        )
      : row.employeeShift?.user && Array.isArray(row.employeeShift?.user)
      ? row.employeeShift.user.map((user) => ({
          name: user.fullName ?? "",
          avatarUrl: user.avatarUrl,
        }))
      : [],
  }));

  const renderDays = useCallback((row: typeof rows[number]) => {
    const days = [
      row.monday && "M",
      row.tuesday && "Tu",
      row.wednesday && "W",
      row.thursday && "Th",
      row.friday && "F",
      row.saturday && "Sa",
      row.sunday && "Su",
    ].filter(Boolean);

    return days.map((day) => (
      <Badge key={day as string} mr={0.5}>
        {day}
      </Badge>
    ));
  }, []);

  const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Shift",
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
        accessorKey: "startTime",
        header: "Start Time",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "location.name",
        header: "Location",
        cell: (item) => item.getValue(),
      },
      {
        header: "Days",
        cell: ({ row }) => renderDays(row.original),
      },
    ];
  }, [renderDays]);

  const renderContextMenu = useCallback(
    (row: typeof rows[number]) => {
      return (
        <>
          <MenuItem
            icon={<BsPencilSquare />}
            onClick={() => {
              navigate(`/x/resources/shifts/${row.id}?${params.toString()}}`);
            }}
          >
            Edit Shift
          </MenuItem>
          <MenuItem
            isDisabled={!permissions.can("delete", "resources")}
            icon={<IoMdTrash />}
            onClick={() => {
              navigate(
                `/x/resources/shifts/delete/${row.id}?${params.toString()}`
              );
            }}
          >
            Delete Shift
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<typeof rows[number]>
      data={rows}
      count={count}
      columns={columns}
      renderContextMenu={renderContextMenu}
    />
  );
});

ShiftsTable.displayName = "ShiftsTable";
export default ShiftsTable;
