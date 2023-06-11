// import type { ActionArgs, LoaderArgs } from "@remix-run/node";
// import { json, redirect } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { validationError } from "remix-validated-form";
// import {
//   getPurchaseOrderLines,
//   PurchaseOrderLinesForm,
//   purchaseOrderLinesValidator,
//   upsertPurchaseOrderLines,
// } from "~/modules/purchasing";
// import { requirePermissions } from "~/services/auth";
// import { flash } from "~/services/session";
// import { assertIsPost } from "~/utils/http";
// import { error, success } from "~/utils/result";

// export async function loader({ request, params }: LoaderArgs) {
//   const { client } = await requirePermissions(request, {
//     view: "purchasing",
//   });

//   const { orderId } = params;
//   if (!orderId) throw new Error("Could not find orderId");

//   const [purchaseOrderLines] = await Promise.all([
//     getPurchaseOrderLines(client, orderId),
//   ]);

//   if (purchaseOrderLines.error) {
//     return redirect(
//       `/x/purchase-order/${orderId}`,
//       await flash(
//         request,
//         error(purchaseOrderLines.error, "Failed to load purchase order lines")
//       )
//     );
//   }

//   return json({
//     purchaseOrderLines: purchaseOrderLines.data,
//   });
// }

// export async function action({ request, params }: ActionArgs) {
//   assertIsPost(request);
//   const { client, userId } = await requirePermissions(request, {
//     update: "purchasing",
//   });

//   const { orderId } = params;
//   if (!orderId) throw new Error("Could not find orderId");

//   // validate with purchasingValidator
//   const validation = await purchaseOrderLinesValidator.validate(
//     await request.formData()
//   );

//   if (validation.error) {
//     return validationError(validation.error);
//   }

//   const updatePurchaseOrderLines = await upsertPurchaseOrderLines(client, {
//     ...validation.data,
//     id: orderId,
//     updatedBy: userId,
//   });
//   if (updatePurchaseOrderLines.error) {
//     return redirect(
//       `/x/purchase-order/${orderId}`,
//       await flash(
//         request,
//         error(
//           updatePurchaseOrderLines.error,
//           "Failed to update purchase order lines"
//         )
//       )
//     );
//   }

//   return redirect(
//     `/x/purchase-order/${orderId}/lines`,
//     await flash(request, success("Updated purchase order lines"))
//   );
// }

// export default function PurchaseOrderLinesRoute() {
//   const { purchaseOrderLines } = useLoaderData<typeof loader>();

//   const initialValues = {
//     id: purchaseOrderLines.id,
//   };

//   return <PurchaseOrderLinesForm initialValues={initialValues} />;
// }

export default function () {
  return null;
}
