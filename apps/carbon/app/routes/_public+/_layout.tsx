import { Flex, VStack } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { Background } from "~/components/Layout";

export default function PublicRoute() {
  return (
    <Flex minW="100vw" minH="100vh">
      <VStack spacing={8} mx="auto" maxW="lg" pt={24} px={6} zIndex={3}>
        <Outlet />
      </VStack>
      <Background />
    </Flex>
  );
}
