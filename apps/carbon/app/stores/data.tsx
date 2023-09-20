import { Image, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { atom, computed } from "nanostores";
import { useEffect, useState } from "react";
import { Background } from "~/components/Layout";
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

  const fetchData = async () => {
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
  };

  useEffect(() => {
    if (!supabase || !accessToken) return;
    fetchData();

    supabase.realtime.setAuth(accessToken);
    const channel = supabase
      .channel("realtime:core")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "part",
        },
        (payload) => {
          const { new: inserted } = payload;
          setParts((parts) => [
            ...parts,
            {
              id: inserted.id,
              name: inserted.name,
              replenishmentSystem: inserted.replenishmentSystem,
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "part",
        },
        (payload) => {
          const { old: deleted } = payload;
          setParts((parts) => parts.filter((p) => p.id !== deleted.id));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "customer",
        },
        (payload) => {
          const { new: inserted } = payload;
          setCustomers((customers) => [
            ...customers,
            {
              id: inserted.id,
              name: inserted.name,
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "part",
        },
        (payload) => {
          const { old: deleted } = payload;
          setCustomers((customers) =>
            customers.filter((c) => c.id !== deleted.id)
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "supplier",
        },
        (payload) => {
          const { new: inserted } = payload;
          setSuppliers((suppliers) => [
            ...suppliers,
            {
              id: inserted.id,
              name: inserted.name,
            },
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "part",
        },
        (payload) => {
          const { old: deleted } = payload;
          setSuppliers((suppliers) =>
            suppliers.filter((c) => c.id !== deleted.id)
          );
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, accessToken]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

function Loading() {
  return (
    <VStack
      h="100vh"
      w="100vw"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      <Image
        src={useColorModeValue(
          "/carbon-logo-dark.png",
          "/carbon-logo-light.png"
        )}
        alt="Carbon Logo"
        maxW={100}
        marginBottom={3}
      />
      <Text letterSpacing={-1} textTransform="uppercase" fontWeight={700}>
        Loading...
      </Text>
      <Background />
    </VStack>
  );
}
