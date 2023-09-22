import { useColor } from "@carbon/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import useBreadcrumbs from "./useBreadcrumbs";

const Breadcrumbs = () => {
  const linkColor = useColor("gray.800");
  const links = useBreadcrumbs() ?? [];

  return (
    <HStack>
      <Breadcrumb noOfLines={1}>
        {links.map((link) => (
          <BreadcrumbItem key={link.to}>
            <BreadcrumbLink
              fontSize="sm"
              fontWeight={500}
              color={linkColor}
              as={Link}
              to={link.to}
              aria-label={link.name}
            >
              {link.icon ? link.icon : link.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </HStack>
  );
};

export default Breadcrumbs;
