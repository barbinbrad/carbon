import { useStore } from "@nanostores/react";
import { type WritableAtom } from "nanostores";
import { useCallback } from "react";

export const useValue = <T>(atom: WritableAtom<T>) => {
  const value = useStore(atom);

  const set = useCallback(
    (value: T | ((current: T) => T)) => {
      if (typeof value === "function") {
        atom.set((value as (current: T) => T)(atom.get()));
      } else {
        atom.set(value);
      }
    },
    [atom]
  );

  return [value, set] as const;
};
