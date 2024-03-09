import { validationError, validator } from "@carbon/remix-validated-form";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ServiceForm, serviceValidator, upsertService } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import type { Handle } from "~/utils/handle";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export const handle: Handle = {
  breadcrumb: "Services",
  to: path.to.services,
};

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await validator(serviceValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const createService = await upsertService(client, {
    ...validation.data,
    active: true,
    createdBy: userId,
  });
  if (createService.error) {
    return redirect(
      path.to.services,
      await flash(
        request,
        error(createService.error, "Failed to create service")
      )
    );
  }

  const serviceId = createService.data?.id;
  if (!serviceId) {
    return redirect(
      path.to.services,
      await flash(
        request,
        error(createService.error, "Failed to create service")
      )
    );
  }

  return redirect(path.to.service(serviceId));
}

export default function ServiceNewRoute() {
  const initialValues = {
    name: "",
    description: "",
    serviceType: "External" as "External",
  };

  return (
    <div className="w-1/2 max-w-[720px] min-w-[420px] mx-auto">
      {/* @ts-ignore */}
      <ServiceForm initialValues={initialValues} />
    </div>
  );
}
