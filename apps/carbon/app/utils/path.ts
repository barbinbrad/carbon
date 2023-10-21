import { generatePath } from "@remix-run/react";

const app = "/x";

export const path = {
  to: {
    authenticatedRoot: app,
    abilities: `${app}/resources/abilities`,
    ability: (id: string) => generatePath(`${app}/resources/ability/${id}`),
    account: `${app}/account`,
    accountPersonal: `${app}/account/personal`,
    accountPassword: `${app}/account/password`,
    accounting: `${app}/accounting`,
    accountingCategoryList: (id: string) =>
      generatePath(`${app}/accounting/categories/list/${id}`),
    accountingCategories: `${app}/accounting/categories`,
    accountingDefaults: `${app}/accounting/defaults`,
    accountingJournals: `${app}/accounting/journals`,
    accountingGroupsBankAccounts: `${app}/accounting/groups/bank-accounts`,
    accountingGroupsFixedAssets: `${app}/accounting/groups/fixed-assets`,
    accountingGroupsInventory: `${app}/accounting/groups/inventory`,
    accountingGroupsPurchasing: `${app}/accounting/groups/purchasing`,
    accountingGroupsSales: `${app}/accounting/groups/sales`,
    attributes: `${app}/resources/attributes`,
    attributeCategoryList: (id: string) =>
      generatePath(`${app}/resources/attributes/list/${id}`),
    chartOfAccounts: `${app}/accounting/charts`,
    contractors: `${app}/resources/contractors`,
    currencies: `${app}/accounting/currencies`,
    customer: (id: string) => generatePath(`${app}/customer/${id}`),
    customers: `${app}/sales/customers`,
    customerAccounts: `${app}/users/customers`,
    customerContacts: (id: string) =>
      generatePath(`${app}/customer/${id}/contacts`),
    customerLocations: (id: string) =>
      generatePath(`${app}/customer/${id}/locations`),
    customerTypes: `${app}/sales/customer-types`,
    deleteAbility: (id: string) =>
      generatePath(`${app}/resources/abilities/delete/${id}`),
    deleteAccountingCharts: (id: string) =>
      generatePath(`${app}/accounting/charts/delete/${id}`),
    deleteContractor: (id: string) =>
      generatePath(`${app}/resources/contractors/delete/${id}`),
    deleteCurrency: (id: string) =>
      generatePath(`${app}/accounting/currencies/delete/${id}`),
    deleteCustomerType: (id: string) =>
      generatePath(`${app}/sales/customer-types/delete/${id}`),
    deleteDepartment: (id: string) =>
      generatePath(`${app}/resources/departments/delete/${id}`),
    deleteEmployeeAbility: (abilityId: string, id: string) =>
      generatePath(
        `${app}/resources/ability/${abilityId}/employee/delete/${id}`
      ),
    deleteEmployeeType: (id: string) =>
      generatePath(`${app}/users/employee-types/delete/${id}`),
    deleteEquipment: (id: string) =>
      generatePath(`${app}/resources/equipment/unit/delete/${id}`),
    deleteGroup: (id: string) =>
      generatePath(`${app}/users/groups/delete/${id}`),
    deleteHoliday: (id: string) =>
      generatePath(`${app}/resources/holidays/delete/${id}`),
    deleteLocation: (id: string) =>
      generatePath(`${app}/resources/locations/delete/${id}`),
    deletePartGroup: (id: string) =>
      generatePath(`${app}/parts/groups/delete/${id}`),
    deletePartner: (id: string) =>
      generatePath(`${app}/resources/partners/delete/${id}`),
    deletePaymentTerm: (id: string) =>
      generatePath(`${app}/accounting/payment-terms/delete/${id}`),
    deletePurchaseOrderLine: (orderId: string, lineId: string) =>
      generatePath(`${app}/purchase-order/${orderId}/details/delete/${lineId}`),
    deleteReceipt: (id: string) =>
      generatePath(`${app}/inventory/receipts/delete/${id}`),
    deleteShift: (id: string) =>
      generatePath(`${app}/resources/shifts/delete/${id}`),
    deleteShippingMethod: (id: string) =>
      generatePath(`${app}/inventory/shipping-methods/delete/${id}`),
    deleteSupplierType: (id: string) =>
      generatePath(`${app}/purchasing/supplier-types/delete/${id}`),
    deleteUom: (id: string) => generatePath(`${app}/parts/uom/delete/${id}`),
    deleteUserAttribute: (id: string) =>
      generatePath(`${app}/account/${id}/delete/attribute`),
    deleteWorkCell: (id: string) =>
      generatePath(`${app}/resources/work-cells/cell/delete/${id}`),
    departments: `${app}/resources/departments`,
    documents: `${app}/documents/search`,
    documentsTrash: `${app}/documents/search?q=trash`,
    employeeAccount: (id: string) =>
      generatePath(`${app}/users/employees/${id}`),
    employeeAccounts: `${app}/users/employees`,
    employeeType: (id: string) => `${app}/users/employee-types/${id}`,
    employeeTypes: `${app}/users/employee-types`,
    equipment: `${app}/resources/equipment`,
    equipmentTypeList: (id: string) =>
      generatePath(`${app}/resources/equipment/list/${id}`),
    fiscalYears: `${app}/accounting/years`,
    forgotPassword: "/forgot-password",
    group: (id: string) => generatePath(`${app}/users/groups/${id}`),
    groups: `${app}/users/groups`,
    holidays: `${app}/resources/holidays`,
    inventory: `${app}/inventory`,
    invoicing: `${app}/invoicing`,
    jobs: `${app}/jobs`,
    locations: `${app}/resources/locations`,
    login: "/login",
    logout: "/logout",
    messaging: `${app}/messaging`,
    newCustomer: `${app}/customer/new`,
    newEmployee: `${app}/users/employees/new`,
    newEmployeeType: `${app}/users/employee-types/new`,
    newGroup: `${app}/users/groups/new`,
    newPart: `${app}/part/new`,
    newPurchaseInvoice: `${app}/purchase-invoice/new`,
    newPurchaseOrder: `${app}/purchase-order/new`,
    newReceipt: `${app}/inventory/receipts/new`,
    newSupplier: `${app}/supplier/new`,
    newSupplierAccount: `${app}/users/suppliers/new`,
    part: (id: string) => generatePath(`${app}/part/${id}`),
    partCosting: (id: string) => generatePath(`${app}/part/${id}/costing`),
    partGroups: `${app}/parts/groups`,
    partInventory: (id: string) => generatePath(`${app}/part/${id}/inventory`),
    partInventoryLocation: (id: string, locationId: string) =>
      generatePath(`${app}/part/${id}/inventory?location=${locationId}`),
    partManufacturing: (id: string) =>
      generatePath(`${app}/part/${id}/manufacturing`),
    partPlanning: (id: string) => generatePath(`${app}/part/${id}/planning`),
    partPlanningLocation: (id: string, locationId: string) =>
      generatePath(`${app}/part/${id}/planning?location=${locationId}`),
    partPricing: (id: string) => generatePath(`${app}/part/${id}/pricing`),
    partPurchasing: (id: string) =>
      generatePath(`${app}/part/${id}/purchasing`),
    partRoot: `${app}/part`,
    partSalePrice: (id: string) => generatePath(`${app}/part/${id}/sale-price`),
    partSuppliers: (id: string) => generatePath(`${app}/part/${id}/suppliers`),
    parts: `${app}/parts`,
    partsSearch: `${app}/parts/search`,
    partners: `${app}/resources/partners`,
    paymentTerms: `${app}/accounting/payment-terms`,
    people: `${app}/resources/people`,
    person: (id: string) => generatePath(`${app}/resources/person/${id}`),
    profile: `${app}/account/profile`,
    purchaseInvoice: (id: string) =>
      generatePath(`${app}/purchase-invoice/${id}`),
    purchaseInvoiceDetails: (id: string) =>
      generatePath(`${app}/purchase-invoice/${id}/details`),
    purchaseInvoices: `${app}/invoicing/purchasing`,
    purchaseOrder: (id: string) => generatePath(`${app}/purchase-order/${id}`),
    purchaseOrderDelivery: (id: string) =>
      generatePath(`${app}/purchase-order/${id}/delivery`),
    purchaseOrderDetails: (id: string) =>
      generatePath(`${app}/purchase-order/${id}/details`),
    purchaseOrderPayment: (id: string) =>
      generatePath(`${app}/purchase-order/${id}/payment`),
    purchaseOrders: `${app}/purchasing/orders`,
    purchasing: `${app}/purchasing`,
    receipt: (id: string) => generatePath(`${app}/inventory/receipts/${id}`),
    receipts: `${app}/inventory/receipts`,
    resendInvite: `${app}/users/resend-invite`,
    resetPassord: "/reset-password",
    resources: `${app}/resources`,
    root: "/",
    sales: `${app}/sales`,
    scheduling: `${app}/scheduling`,
    settings: `${app}/settings`,
    sequences: `${app}/settings/sequences`,
    shifts: `${app}/resources/shifts`,
    shippingMethods: `${app}/inventory/shipping-methods`,
    supplier: (id: string) => generatePath(`${app}/supplier/${id}`),
    suppliers: `${app}/purchasing/suppliers`,
    supplierAccounts: `${app}/users/suppliers`,
    supplierContacts: (id: string) =>
      generatePath(`${app}/supplier/${id}/contacts`),
    supplierLocations: (id: string) =>
      generatePath(`${app}/supplier/${id}/locations`),
    supplierTypes: `${app}/purchasing/supplier-types`,
    timecards: `${app}/timecards`,
    uom: `${app}/parts/uom`,
    userAttribute: (id: string) =>
      generatePath(`${app}/account/${id}/attribute`),
    users: `${app}/users`,
    workCells: `${app}/resources/work-cells`,
    workCellTypeList: (id: string) =>
      generatePath(`/${app}/resources/work-cells/list/${id}`),
  },
} as const;
