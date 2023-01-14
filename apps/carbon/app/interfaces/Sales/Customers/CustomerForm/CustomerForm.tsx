import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";

const CustomerForm = () => {
  const navigate = useNavigate();

  return (
    <Drawer onClose={() => navigate(-1)} isOpen size="full">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>New Customer</DrawerHeader>
        <DrawerBody>Customer Form</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerForm;
