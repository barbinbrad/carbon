import {
  Card,
  CardAction,
  CardAttribute,
  CardAttributeLabel,
  CardAttributeValue,
  CardAttributes,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Enumerable,
  HStack,
  Menubar,
  VStack,
} from "@carbon/react";

import { useParams } from "@remix-run/react";
import { Assign, EmployeeAvatar, useOptimisticAssignment } from "~/components";
import { usePermissions, useRouteData } from "~/hooks";
import type { Service } from "~/modules/parts";
import { path } from "~/utils/path";

const ServiceHeader = () => {
  const permissions = usePermissions();
  const { serviceId } = useParams();
  if (!serviceId) throw new Error("serviceId not found");

  const routeData = useRouteData<{ service: Service }>(
    path.to.service(serviceId)
  );

  const optimisticAssignment = useOptimisticAssignment({
    id: serviceId,
    table: "service",
  });
  const assignee =
    optimisticAssignment !== undefined
      ? optimisticAssignment
      : routeData?.service?.assignee;

  return (
    <VStack>
      {permissions.is("employee") && (
        <Menubar>
          <Assign
            id={serviceId}
            table="service"
            value={routeData?.service?.assignee ?? ""}
          />
        </Menubar>
      )}
      <Card>
        <HStack className="justify-between items-start">
          <CardHeader>
            <CardTitle>{routeData?.service?.id}</CardTitle>
            <CardDescription>{routeData?.service?.name}</CardDescription>
          </CardHeader>
          <CardAction>
            {/* <Button
            variant="secondary"
            onClick={() => alert("TODO")}
            leftIcon={<FaHistory />}
          >
            View History
          </Button> */}
          </CardAction>
        </HStack>
        <CardContent>
          <CardAttributes>
            <CardAttribute>
              <CardAttributeLabel>Assignee</CardAttributeLabel>
              <CardAttributeValue>
                {assignee ? (
                  <EmployeeAvatar employeeId={assignee ?? null} />
                ) : (
                  "-"
                )}
              </CardAttributeValue>
            </CardAttribute>
            <CardAttribute>
              <CardAttributeLabel>Service Type</CardAttributeLabel>
              <CardAttributeValue>
                <Enumerable value={routeData?.service?.serviceType ?? null} />
              </CardAttributeValue>
            </CardAttribute>
          </CardAttributes>
        </CardContent>
      </Card>
    </VStack>
  );
};

export default ServiceHeader;
