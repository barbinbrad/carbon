import { VStack } from "@chakra-ui/react";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: "Routing",
  to: path.to.routings,
};

export default function PartsConfiguratorRoute() {
  return <VStack w="full" h="full" spacing={0}></VStack>;
}
