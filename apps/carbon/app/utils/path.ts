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
    attribute: (id: string) => generatePath(`${app}/resources/attribute/${id}`),
    attributes: `${app}/resources/attributes`,
    attributeCategory: (id: string) =>
      generatePath(`${app}/resources/attributes/${id}`),
    attributeCategoryList: (id: string) =>
      generatePath(`${app}/resources/attributes/list/${id}`),
    bulkEditPermissions: `${app}/users/bulk-edit-permissions`,
    chartOfAccounts: `${app}/accounting/charts`,
    contractor: (id: string) =>
      generatePath(`${app}/resources/contractors/${id}`),
    contractors: `${app}/resources/contractors`,
    currency: (id: string) =>
      generatePath(`${app}/accounting/currencies/${id}`),
    currencies: `${app}/accounting/currencies`,
    customer: (id: string) => generatePath(`${app}/customer/${id}`),
    customerRoot: `${app}/customer`,
    customers: `${app}/sales/customers`,
    customerAccounts: `${app}/users/customers`,
    customerContact: (customerId: string, id: string) =>
      generatePath(`${app}/customer/${customerId}/contacts/${id}`),
    customerContacts: (id: string) =>
      generatePath(`${app}/customer/${id}/contacts`),
    customerLocation: (customerId: string, id: string) =>
      generatePath(`${app}/customer/${customerId}/locations/${id}`),
    customerLocations: (id: string) =>
      generatePath(`${app}/customer/${id}/locations`),
    customerType: (id: string) =>
      generatePath(`${app}/sales/customer-types/delete/${id}`),
    customerTypes: `${app}/sales/customer-types`,
    deactivateUsers: `${app}/users/deactivate`,
    deleteAbility: (id: string) =>
      generatePath(`${app}/resources/abilities/delete/${id}`),
    deleteAccountingCharts: (id: string) =>
      generatePath(`${app}/accounting/charts/delete/${id}`),
    deleteAttribute: (id: string) =>
      generatePath(`${app}/resources/attribute/delete/${id}`),
    deleteAttributeCategory: (id: string) =>
      generatePath(`${app}/resources/attributes/delete/${id}`),
    deleteContractor: (id: string) =>
      generatePath(`${app}/resources/contractors/delete/${id}`),
    deleteCurrency: (id: string) =>
      generatePath(`${app}/accounting/currencies/delete/${id}`),
    deleteCustomerContact: (customerId: string, id: string) =>
      generatePath(`${app}/customer/${customerId}/contacts/delete/${id}`),
    deleteCustomerLocation: (customerId: string, id: string) =>
      generatePath(`${app}/customer/${customerId}/locations/delete/${id}`),
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
    deleteEquipmentType: (id: string) =>
      generatePath(`${app}/resources/equipment/delete/${id}`),
    deleteGroup: (id: string) =>
      generatePath(`${app}/users/groups/delete/${id}`),
    deleteHoliday: (id: string) =>
      generatePath(`${app}/resources/holidays/delete/${id}`),
    deleteLocation: (id: string) =>
      generatePath(`${app}/resources/locations/delete/${id}`),
    deleteNote: (id: string) =>
      generatePath(`${app}/shared/notes/${id}/delete`),
    deletePartGroup: (id: string) =>
      generatePath(`${app}/parts/groups/delete/${id}`),
    deletePartner: (id: string) =>
      generatePath(`${app}/resources/partners/delete/${id}`),
    deletePaymentTerm: (id: string) =>
      generatePath(`${app}/accounting/payment-terms/delete/${id}`),
    deletePurchaseOrder: (id: string) =>
      generatePath(`${app}/purchase-order/${id}/delete`),
    deletePurchaseOrderLine: (orderId: string, lineId: string) =>
      generatePath(`${app}/purchase-order/${orderId}/details/delete/${lineId}`),
    deleteReceipt: (id: string) =>
      generatePath(`${app}/inventory/receipts/delete/${id}`),
    deleteShift: (id: string) =>
      generatePath(`${app}/resources/shifts/delete/${id}`),
    deleteShippingMethod: (id: string) =>
      generatePath(`${app}/inventory/shipping-methods/delete/${id}`),
    deleteSupplierContact: (supplierId: string, id: string) =>
      generatePath(`${app}/supplier/${supplierId}/contacts/delete/${id}`),
    deleteSupplierLocation: (supplierId: string, id: string) =>
      generatePath(`${app}/supplier/${supplierId}/locations/delete/${id}`),
    deleteSupplierType: (id: string) =>
      generatePath(`${app}/purchasing/supplier-types/delete/${id}`),
    deleteUom: (id: string) => generatePath(`${app}/parts/uom/delete/${id}`),
    deleteUserAttribute: (id: string) =>
      generatePath(`${app}/account/${id}/delete/attribute`),
    deleteWorkCell: (id: string) =>
      generatePath(`${app}/resources/work-cells/cell/delete/${id}`),
    deleteWorkCellType: (id: string) =>
      generatePath(`${app}/resources/work-cells/delete/${id}`),
    department: (id: string) =>
      generatePath(`${app}/resources/departments/${id}`),
    departments: `${app}/resources/departments`,
    documents: `${app}/documents/search`,
    documentsTrash: `${app}/documents/search?q=trash`,
    employeeAbility: (abilityId: string, id: string) =>
      generatePath(`${app}/resources/ability/${abilityId}/employee/${id}`),
    employeeAccount: (id: string) =>
      generatePath(`${app}/users/employees/${id}`),
    employeeAccounts: `${app}/users/employees`,
    employeeType: (id: string) =>
      generatePath(`${app}/users/employee-types/${id}`),
    employeeTypes: `${app}/users/employee-types`,
    equipment: `${app}/resources/equipment`,
    equipmentType: (id: string) =>
      generatePath(`${app}/resources/equipment/${id}`),
    equipmentTypeList: (id: string) =>
      generatePath(`${app}/resources/equipment/list/${id}`),
    equipmentUnit: (id: string) =>
      generatePath(`${app}/resources/equipment/unit/${id}`),
    fiscalYears: `${app}/accounting/years`,
    forgotPassword: "/forgot-password",
    group: (id: string) => generatePath(`${app}/users/groups/${id}`),
    groups: `${app}/users/groups`,
    holiday: (id: string) => generatePath(`${app}/resources/holidays/${id}`),
    holidays: `${app}/resources/holidays`,
    inventory: `${app}/inventory`,
    invoicing: `${app}/invoicing`,
    jobs: `${app}/jobs`,
    location: (id: string) => generatePath(`${app}/resources/locations/${id}`),
    locations: `${app}/resources/locations`,
    login: "/login",
    logout: "/logout",
    messaging: `${app}/messaging`,
    newAbility: `${app}/resources/abilities/new`,
    newAccountingSubcategory: (id: string) =>
      generatePath(`${app}/accounting/categories/list/${id}/new`),
    newAttribute: `${app}/resources/attribute/new`,
    newAttributeCategory: `${app}/resources/attributes/new`,
    newAttributeForCategory: (id: string) =>
      generatePath(`${app}/resources/attributes/list/${id}/new`),
    newContractor: `${app}/resources/contractors/new`,
    newCustomer: `${app}/customer/new`,
    newCustomerAccount: `${app}/users/customers/new`,
    newCustomerContact: (id: string) =>
      generatePath(`${app}/customer/${id}/contacts/new`),
    newCustomerLocation: (id: string) =>
      generatePath(`${app}/customer/${id}/locations/new`),
    newCustomerType: `${app}/sales/customer-types/new`,
    newDepartment: `${app}/resources/departments/new`,
    newEmployee: `${app}/users/employees/new`,
    newEmployeeAbility: (id: string) =>
      generatePath(`${app}/resources/ability/${id}/employee/new`),
    newEmployeeType: `${app}/users/employee-types/new`,
    newEquipment: (id: string) =>
      generatePath(`${app}/resources/equipment/list/${id}/new`),
    newEquipmentUnit: `${app}/resources/equipment/unit/new`,
    newEquipmentType: `${app}/resources/equipment/new`,
    newGroup: `${app}/users/groups/new`,
    newHoliday: `${app}/resources/holidays/new`,
    newLocation: `${app}/resources/locations/new`,
    newNote: `${app}/shared/notes/new`,
    newPart: `${app}/part/new`,
    newPartGroup: `${app}/parts/groups/new`,
    newPartSupplier: (id: string) =>
      generatePath(`${app}/part/${id}/suppliers/new`),
    newPartner: `${app}/resources/partners/new`,
    newPurchaseInvoice: `${app}/purchase-invoice/new`,
    newPurchaseOrder: `${app}/purchase-order/new`,
    newPurchaseOrderLine: (id: string) =>
      generatePath(`${app}/purchase-order/${id}/details/new`),
    newReceipt: `${app}/inventory/receipts/new`,
    newShift: `${app}/resources/shifts/new`,
    newSupplier: `${app}/supplier/new`,
    newSupplierAccount: `${app}/users/suppliers/new`,
    newSupplierContact: (id: string) =>
      generatePath(`${app}/supplier/${id}/contacts/new`),
    newSupplierLocation: (id: string) =>
      generatePath(`${app}/supplier/${id}/locations/new`),
    newSupplierType: `${app}/purchasing/supplier-types/new`,
    newUom: `${app}/parts/uom/new`,
    newWorkCell: `${app}/resources/work-cells/cell/new`,
    newWorkCellUnit: (id: string) =>
      generatePath(`${app}/resources/work-cells/list/${id}/new`),
    newWorkCellType: `${app}/resources/work-cells/new`,
    part: (id: string) => generatePath(`${app}/part/${id}`),
    partCosting: (id: string) => generatePath(`${app}/part/${id}/costing`),
    partGroup: (id: string) => generatePath(`${app}/parts/groups/delete/${id}`),
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
    partSupplier: (partId: string, id: string) =>
      generatePath(`/x/part/${partId}/suppliers/${id}`),
    partSuppliers: (id: string) => generatePath(`${app}/part/${id}/suppliers`),
    parts: `${app}/parts`,
    partsSearch: `${app}/parts/search`,
    partner: (id: string) => generatePath(`${app}/resources/partners/${id}`),
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
    purchaseOrderLine: (orderId: string, id: string) =>
      generatePath(`${app}/purchase-order/${orderId}/details/${id}`),
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
    routings: `${app}/parts/routing`,
    sales: `${app}/sales`,
    scheduling: `${app}/scheduling`,
    settings: `${app}/settings`,
    sequences: `${app}/settings/sequences`,
    shift: (id: string) => generatePath(`${app}/resources/shifts/${id}`),
    shifts: `${app}/resources/shifts`,
    shippingMethods: `${app}/inventory/shipping-methods`,
    supplier: (id: string) => generatePath(`${app}/supplier/${id}`),
    suppliers: `${app}/purchasing/suppliers`,
    supplierAccounts: `${app}/users/suppliers`,
    supplierContact: (supplierId: string, id: string) =>
      generatePath(`${app}/supplier/${supplierId}/contacts/${id}`),
    supplierContacts: (id: string) =>
      generatePath(`${app}/supplier/${id}/contacts`),
    supplierLocation: (supplierId: string, id: string) =>
      generatePath(`${app}/supplier/${supplierId}/locations/${id}`),
    supplierLocations: (id: string) =>
      generatePath(`${app}/supplier/${id}/locations`),
    supplierRoot: `${app}/supplier`,
    supplierType: (id: string) =>
      generatePath(`${app}/purchasing/supplier-types/delete/${id}`),
    supplierTypes: `${app}/purchasing/supplier-types`,
    tableSequence: (id: string) =>
      generatePath(`${app}/settings/sequences/${id}`),
    timecards: `${app}/timecards`,
    uom: (id: string) => generatePath(`${app}/parts/uom/${id}`),
    uoms: `${app}/parts/uom`,
    userAttribute: (id: string) =>
      generatePath(`${app}/account/${id}/attribute`),
    users: `${app}/users`,
    workCell: (id: string) =>
      generatePath(`${app}/resources/work-cells/cell/${id}`),
    workCells: `${app}/resources/work-cells`,
    workCellType: (id: string) =>
      generatePath(`${app}/resources/work-cells/${id}`),
    workCellTypeList: (id: string) =>
      generatePath(`/${app}/resources/work-cells/list/${id}`),
  },
} as const;
