import { useColor } from "@carbon/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
} from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { z } from "zod";

export const BreadcrumbHandle = z.object({
  breadcrumb: z.any(),
  to: z.string().optional(),
});
export type BreadcrumbHandleType = z.infer<typeof BreadcrumbHandle>;

const BreadcrumbHandleMatch = z.object({
  handle: BreadcrumbHandle,
});

const Breadcrumbs = () => {
  const matches = useMatches();
  const linkColor = useColor("gray.800");

  const breadcrumbs = matches
    .map((m) => {
      const result = BreadcrumbHandleMatch.safeParse(m);
      if (!result.success || !result.data.handle.breadcrumb) return null;

      return {
        breadcrumb: result.data.handle.breadcrumb,
        to: result.data.handle?.to ?? m.pathname,
      };
    })
    .filter(Boolean);

  return (
    <HStack>
      <Breadcrumb noOfLines={1}>
        {breadcrumbs.map((breadcrumb, i) => (
          <BreadcrumbItem key={i}>
            <BreadcrumbLink
              fontSize="sm"
              fontWeight={500}
              color={linkColor}
              as={Link}
              to={breadcrumb?.to}
            >
              {breadcrumb?.breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </HStack>
  );
};

export default Breadcrumbs;
