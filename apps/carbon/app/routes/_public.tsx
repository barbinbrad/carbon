import { Flex, VStack } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import background from "~/styles/background.css";

export function links() {
  return [{ rel: "stylesheet", href: background }];
}

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

function Background() {
  return (
    <div className="background">
      <div className="gradient" />
    </div>
  );
}
