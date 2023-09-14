import { useEffect } from "react";

export default function useEscape(
  callback: ((e?: KeyboardEvent) => void) | (() => void)
) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback(e);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [callback]);
}
