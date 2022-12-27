import { useColor } from "@carbon/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
} from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import type { Route } from "~/types";

type BreadcrumbProps = {
  links: Route[];
};

const Breadcrumbs = ({ links = [] }: BreadcrumbProps) => {
  const linkColor = useColor("gray.800");

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
