import { Box } from "@chakra-ui/react";
import { UserSelect } from "~/components/Selectors";

export default function AppRoute() {
  return (
    <Box maxW={400} p={4}>
      <UserSelect />
    </Box>
  );
}
