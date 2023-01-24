import { Box } from "@chakra-ui/react";
import { UserSelect } from "~/components/Selectors";

export default function AppRoute() {
  return (
    <Box maxW={400} p={4}>
      <UserSelect
        isMulti
        placeholder="Select users"
        selectionsMaxHeight={"calc(100vh - 120px)"}
        value={"00000000-0000-0000-0000-000000000000"}
      />
    </Box>
  );
}
