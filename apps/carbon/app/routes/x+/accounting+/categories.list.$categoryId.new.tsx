import { useNavigate, useParams } from "@remix-run/react";
import { AccountSubcategoryForm } from "~/modules/accounting";

export default function NewAccountSubcategoryRoute() {
  const { categoryId } = useParams();
  if (!categoryId) throw new Error("categoryId is not found");

  const navigate = useNavigate();
  const onClose = () => navigate(-1);

  const initialValues = {
    name: "",
    accountCategoryId: categoryId,
  };

  return (
    <AccountSubcategoryForm initialValues={initialValues} onClose={onClose} />
  );
}
