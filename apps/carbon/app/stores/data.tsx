import { Flex } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { atom, computed } from "nanostores";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "~/lib/supabase";
import type { ListItem } from "~/types";
import { useValue } from "./nanostore";

const partsStore = atom<
  (ListItem & { replenishmentSystem: "Buy" | "Make" | "Buy and Make" })[]
>([]);
export const useParts = () => useValue(partsStore);

const purchasedPartsStore = computed(partsStore, (part) =>
  part.filter((i) => i.replenishmentSystem === "Buy")
);
export const usePurchasedParts = () => useStore(purchasedPartsStore);

const manufacturedPartsStore = computed(partsStore, (part) =>
  part.filter((i) => i.replenishmentSystem === "Make")
);
export const useManufacturedParts = () => useStore(manufacturedPartsStore);

const suppliersStore = atom<ListItem[]>([]);
export const useSuppliers = () => useValue(suppliersStore);

const customersStore = atom<ListItem[]>([]);
export const useCustomers = () => useValue(customersStore);

export const RealtimeDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const { supabase, accessToken } = useSupabase();

  const [, setParts] = useParts();
  const [, setSuppliers] = useSuppliers();
  const [, setCustomers] = useCustomers();

  const fetchData = useCallback(async () => {
    if (!supabase || !accessToken) return;

    const [parts, suppliers, customers] = await Promise.all([
      supabase
        .from("part")
        .select("id, name, replenishmentSystem")
        .eq("active", true),
      supabase.from("supplier").select("id, name"),
      supabase.from("customer").select("id, name"),
    ]);

    if (parts.error || suppliers.error || customers.error) {
      throw new Error("Failed to fetch core data");
    }

    setParts(parts.data ?? []);
    setSuppliers(suppliers.data ?? []);
    setCustomers(customers.data ?? []);

    setLoading(false);
  }, [supabase, accessToken, setParts, setSuppliers, setCustomers]);

  useEffect(() => {
    if (!supabase || !accessToken) return;
    fetchData();
  }, [supabase, accessToken, fetchData]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

function Loading() {
  return (
    <Flex
      bg="white"
      h="100vh"
      w="full"
      alignItems="center"
      justifyContent="center"
      zIndex="50"
    >
      Loading...
    </Flex>
  );
}
