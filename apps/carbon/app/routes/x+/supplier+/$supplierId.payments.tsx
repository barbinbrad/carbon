import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import {
  SupplierPaymentForm,
  getSupplierPayment,
  supplierPaymentValidator,
  updateSupplierPayment,
} from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const supplierPayment = await getSupplierPayment(client, supplierId);

  if (supplierPayment.error || !supplierPayment.data) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(supplierPayment.error, "Failed to load supplier payment")
      )
    );
  }

  return json({
    supplierPayment: supplierPayment.data,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    update: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  // validate with purchasingValidator
  const validation = await supplierPaymentValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const update = await updateSupplierPayment(client, {
    ...validation.data,
    supplierId,
    updatedBy: userId,
  });
  if (update.error) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(update.error, "Failed to update supplier payment")
      )
    );
  }

  return redirect(
    path.to.supplierPayment(supplierId),
    await flash(request, success("Updated supplier payment"))
  );
}

export default function SupplierPaymentRoute() {
  const { supplierPayment } = useLoaderData<typeof loader>();
  const initialValues = {
    supplierId: supplierPayment?.supplierId ?? "",
    invoiceSupplierId: supplierPayment?.invoiceSupplierId ?? "",
    invoiceSupplierContactId: supplierPayment?.invoiceSupplierContactId ?? "",
    invoiceSupplierLocationId: supplierPayment?.invoiceSupplierLocationId ?? "",
    paymentTermId: supplierPayment?.paymentTermId ?? "",
    currencyCode: supplierPayment?.currencyCode ?? "",
  };

  return <SupplierPaymentForm initialValues={initialValues} />;
}
