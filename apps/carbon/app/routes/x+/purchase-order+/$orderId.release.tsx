import { PurchaseOrderEmail } from "@carbon/documents";
import { validationError, validator } from "@carbon/remix-validated-form";
import { renderAsync } from "@react-email/components";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { triggerClient } from "~/lib/trigger.server";
import {
  getPurchaseOrder,
  getPurchaseOrderLines,
  getPurchaseOrderLocations,
  getSupplierContact,
  purchaseOrderReleaseValidator,
  releasePurchaseOrder,
} from "~/modules/purchasing";
import { getCompany } from "~/modules/settings";
import { getUser } from "~/modules/users/users.server";
import { loader as pdfLoader } from "~/routes/file+/purchase-order+/$orderId[.]pdf";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session.server";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action(args: ActionFunctionArgs) {
  const { request, params } = args;
  assertIsPost(request);

  const { client, userId } = await requirePermissions(request, {
    create: "purchasing",
    role: "employee",
  });

  const { orderId } = params;
  if (!orderId) throw new Error("Could not find orderId");

  let file: ArrayBuffer;
  let bucketName = orderId;
  let fileName: string;

  const release = await releasePurchaseOrder(client, orderId, userId);
  if (release.error) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(
        request,
        error(release.error, "Failed to release purchase order")
      )
    );
  }

  const purchaseOrder = await getPurchaseOrder(client, orderId);
  if (purchaseOrder.error) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(
        request,
        error(purchaseOrder.error, "Failed to get purchase order")
      )
    );
  }

  try {
    const pdf = await pdfLoader(args);
    if (pdf.headers.get("content-type") !== "application/pdf")
      throw new Error("Failed to generate PDF");

    file = await pdf.arrayBuffer();
    fileName = `${purchaseOrder.data.purchaseOrderId} - ${new Date()
      .toISOString()
      .slice(0, -5)}.pdf`;

    const fileUpload = await client.storage
      .from("purchasing-external")
      .upload(`${bucketName}/${fileName}`, file, {
        cacheControl: `${12 * 60 * 60}`,
        contentType: "application/pdf",
      });

    if (fileUpload.error) {
      return redirect(
        path.to.purchaseOrder(orderId),
        await flash(request, error(fileUpload.error, "Failed to upload file"))
      );
    }
  } catch (err) {
    return redirect(
      path.to.purchaseOrder(orderId),
      await flash(request, error(err, "Failed to generate PDF"))
    );
  }

  const validation = await validator(purchaseOrderReleaseValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { notification, supplierContact } = validation.data;

  switch (notification) {
    case "Email":
      try {
        if (!supplierContact) throw new Error("Supplier contact is required");

        const [
          company,
          supplier,
          purchaseOrder,
          purchaseOrderLines,
          purchaseOrderLocations,
          buyer,
        ] = await Promise.all([
          getCompany(client),
          getSupplierContact(client, supplierContact),
          getPurchaseOrder(client, orderId),
          getPurchaseOrderLines(client, orderId),
          getPurchaseOrderLocations(client, orderId),
          getUser(client, userId),
        ]);

        if (!supplier?.data?.contact)
          throw new Error("Failed to get supplier contact");
        if (!company.data) throw new Error("Failed to get company");
        if (!buyer.data) throw new Error("Failed to get user");
        if (!purchaseOrder.data)
          throw new Error("Failed to get purchase order");
        if (!purchaseOrderLocations.data)
          throw new Error("Failed to get purchase order locations");

        const emailTemplate = PurchaseOrderEmail({
          company: company.data,
          purchaseOrder: purchaseOrder.data,
          purchaseOrderLines: purchaseOrderLines.data ?? [],
          purchaseOrderLocations: purchaseOrderLocations.data,
          recipient: {
            email: supplier.data.contact.email,
            firstName: supplier.data.contact.firstName,
            lastName: supplier.data.contact.lastName,
          },
          sender: {
            email: buyer.data.email,
            firstName: buyer.data.firstName,
            lastName: buyer.data.lastName,
          },
        });

        await triggerClient.sendEvent({
          name: "resend.email",
          payload: {
            to: [buyer.data.email, supplier.data.contact.email],
            from: buyer.data.email,
            subject: `${purchaseOrder.data.purchaseOrderId} from ${company.data.name}`,
            html: await renderAsync(emailTemplate),
            text: await renderAsync(emailTemplate, { plainText: true }),
            attachments: [
              {
                content: Buffer.from(file),
                filename: fileName,
              },
            ],
          },
        });
      } catch (err) {
        return redirect(
          path.to.purchaseOrder(orderId),
          await flash(request, error(err, "Failed to send email"))
        );
      }

      break;
    case undefined:
    case "None":
      break;
    default:
      throw new Error("Invalid notification type");
  }

  return redirect(
    path.to.purchaseOrderExternalDocuments(orderId),
    await flash(request, success("Purchase order released"))
  );
}
