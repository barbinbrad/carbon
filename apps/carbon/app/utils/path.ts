const app = "/x";
export const path = {
  accounting: `${app}/accounting`,
  accountingCategoryList: (id: string) =>
    `${app}/accounting/categories/list/${id}`,
  accountingCategories: `${app}/accounting/categories`,
  accountingDefaults: `${app}/accounting/defaults`,
  chartOfAccounts: `${app}/accounting/charts`,
  currencies: `${app}/accounting/currencies`,
  customer: (id: string) => `${app}/customer/${id}`,
  customers: `${app}/sales/customers`,
  customerContacts: (id: string) => `${app}/customer/${id}/contacts`,
  customerLocations: (id: string) => `${app}/customer/${id}/locations`,
  documents: `${app}/documents/search`,
  documentsTrash: `${app}/documents/search?q=trash`,
  fiscalYears: `${app}/accounting/years`,
  forgotPassword: "/forgot-password",
  home: app,
  paymentTerms: `${app}/accounting/payment-terms`,
  profile: `${app}/account/profile`,
  resetPassord: "/reset-password",
  root: "/",
} as const;
