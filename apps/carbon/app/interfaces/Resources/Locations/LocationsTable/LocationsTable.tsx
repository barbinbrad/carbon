import { ActionMenu } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { usePermissions } from "~/hooks";
import type { ShiftLocation } from "~/interfaces/Resources/types";

type LocationsTableProps = {
  data: ShiftLocation[];
  count: number;
};

const LocationsTable = memo(({ data, count }: LocationsTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    ...row,
  }));

  const columns = useMemo<ColumnDef<typeof rows[number]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "Location",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "timezone",
        header: "Timezone",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "latitude",
        header: "Latitude",
        cell: (item) => item.getValue(),
      },
      {
        accessorKey: "longitude",
        header: "Longitude",
        cell: (item) => item.getValue(),
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
                  navigate(`/x/resources/locations/${row.original.id}`);
                }}
              >
                Edit Location
              </MenuItem>
              <MenuItem
                isDisabled={!permissions.can("delete", "resources")}
                icon={<IoMdTrash />}
                onClick={() => {
                  navigate(`/x/resources/locations/delete/${row.original.id}`);
                }}
              >
                Delete Location
              </MenuItem>
            </ActionMenu>
          </Flex>
        ),
      },
    ];
  }, [navigate, permissions]);

  return (
    <Table<typeof rows[number]> data={rows} count={count} columns={columns} />
  );
});

LocationsTable.displayName = "LocationsTable";
export default LocationsTable;
