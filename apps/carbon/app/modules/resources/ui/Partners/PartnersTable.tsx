import {
  Avatar,
  Enumerable,
  HStack,
  Hyperlink,
  MenuIcon,
  MenuItem,
} from "@carbon/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { BsFillPenFill } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { New, Table } from "~/components";
import { usePermissions, useUrlParams } from "~/hooks";
import type { Ability, Partner } from "~/modules/resources";
import { useSuppliers } from "~/stores";
import { useCustomColumns } from "~/hooks/useCustomColumns";
import { path } from "~/utils/path";

type PartnersTableProps = {
  data: Partner[];
  count: number;
  abilities: Partial<Ability>[];
};

const PartnersTable = memo(({ data, count, abilities }: PartnersTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();
  const [params] = useUrlParams();
  const [suppliers] = useSuppliers();

  const customColumns = useCustomColumns<Partner>("partner");
  const columns = useMemo<ColumnDef<Partner>[]>(() => {
    const defaultColumns: ColumnDef<Partner>[] = [
      {
        accessorKey: "supplierName",
        header: "Supplier",
        cell: ({ row }) => (
          <HStack>
            <Avatar size="sm" name={row.original.supplierName ?? ""} />

            <Hyperlink
              onClick={() => {
                navigate(
                  `${path.to.partner(
                    row.original.supplierLocationId!,
                    row.original.abilityId!
                  )}?${params.toString()}`
                );
              }}
            >
              {row.original.supplierName}
            </Hyperlink>
          </HStack>
        ),
        meta: {
          filter: {
            type: "static",
            options: suppliers.map((supplier) => ({
              value: supplier.name,
              label: supplier.name,
            })),
          },
        },
      },
      {
        header: "Location",
        cell: ({ row }) => `${row.original.city}, ${row.original.state}`,
      },
      {
        accessorKey: "abilityName",
        header: "Ability",
        cell: (item) => <Enumerable value={item.getValue<string>()} />,
        meta: {
          filter: {
            type: "static",
            options: abilities.map((ability) => ({
              value: ability.name,
              label: <Enumerable value={ability.name} />,
            })),
          },
        },
      },
      {
        accessorKey: "hoursPerWeek",
        header: "Hours per Week",
        cell: (item) => item.getValue(),
      },
    ];
    return [...defaultColumns, ...customColumns];
  }, [navigate, params, customColumns, suppliers, abilities]);

  const renderContextMenu = useCallback(
    (row: Partner) => {
      return (
        <>
          <MenuItem
            onClick={() => {
              navigate(
                `${path.to.partner(
                  row.supplierLocationId!,
                  row.abilityId!
                )}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<BsFillPenFill />} />
            Edit Partner
          </MenuItem>
          <MenuItem
            disabled={!permissions.can("delete", "resources")}
            onClick={() => {
              navigate(
                `${path.to.deletePartner(
                  row.supplierLocationId!
                )}?${params.toString()}`
              );
            }}
          >
            <MenuIcon icon={<IoMdTrash />} />
            Delete Partner
          </MenuItem>
        </>
      );
    },
    [navigate, params, permissions]
  );

  return (
    <Table<Partner>
      data={data}
      count={count}
      columns={columns}
      primaryAction={
        permissions.can("create", "resources") && (
          <New label="Partner" to={`new?${params.toString()}`} />
        )
      }
      renderContextMenu={renderContextMenu}
    />
  );
});

PartnersTable.displayName = "PartnersTable";
export default PartnersTable;
