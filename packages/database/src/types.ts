export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ability: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          curve: Json
          id: string
          name: string
          shadowWeeks: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          curve?: Json
          id?: string
          name: string
          shadowWeeks?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          curve?: Json
          id?: string
          name?: string
          shadowWeeks?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abilities_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abilities_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "abilities_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abilities_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      account: {
        Row: {
          accountCategoryId: string | null
          accountSubcategoryId: string | null
          active: boolean
          consolidatedRate:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt: string
          createdBy: string
          directPosting: boolean
          id: string
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"]
          name: string
          normalBalance: Database["public"]["Enums"]["glNormalBalance"]
          number: string
          type: Database["public"]["Enums"]["glAccountType"]
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountCategoryId?: string | null
          accountSubcategoryId?: string | null
          active?: boolean
          consolidatedRate?:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt?: string
          createdBy: string
          directPosting?: boolean
          id?: string
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"]
          name: string
          normalBalance: Database["public"]["Enums"]["glNormalBalance"]
          number: string
          type: Database["public"]["Enums"]["glAccountType"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountCategoryId?: string | null
          accountSubcategoryId?: string | null
          active?: boolean
          consolidatedRate?:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt?: string
          createdBy?: string
          directPosting?: boolean
          id?: string
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"]
          name?: string
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"]
          number?: string
          type?: Database["public"]["Enums"]["glAccountType"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "account_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      accountCategory: {
        Row: {
          category: string
          createdAt: string
          createdBy: string
          id: string
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"]
          normalBalance: Database["public"]["Enums"]["glNormalBalance"]
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          category: string
          createdAt?: string
          createdBy: string
          id?: string
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"]
          normalBalance: Database["public"]["Enums"]["glNormalBalance"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          category?: string
          createdAt?: string
          createdBy?: string
          id?: string
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"]
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accountCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      accountDefault: {
        Row: {
          accumulatedDepreciationAccount: string
          accumulatedDepreciationOnDisposalAccount: string
          assetAquisitionCostAccount: string
          assetAquisitionCostOnDisposalAccount: string
          assetDepreciationExpenseAccount: string
          assetGainsAndLossesAccount: string
          bankCashAccount: string
          bankForeignCurrencyAccount: string
          bankLocalCurrencyAccount: string
          capacityVarianceAccount: string
          costOfGoodsSoldAccount: string
          customerPaymentDiscountAccount: string
          directCostAppliedAccount: string
          id: boolean
          interestAccount: string
          inventoryAccount: string
          inventoryAdjustmentVarianceAccount: string
          inventoryInterimAccrualAccount: string
          inventoryReceivedNotInvoicedAccount: string
          inventoryShippedNotInvoicedAccount: string
          maintenanceAccount: string
          materialVarianceAccount: string
          overheadAccount: string
          overheadCostAppliedAccount: string
          payablesAccount: string
          prepaymentAccount: string
          purchaseAccount: string
          purchaseTaxPayableAccount: string
          purchaseVarianceAccount: string
          receivablesAccount: string
          retainedEarningsAccount: string
          reverseChargeSalesTaxPayableAccount: string
          roundingAccount: string
          salesAccount: string
          salesDiscountAccount: string
          salesTaxPayableAccount: string
          serviceChargeAccount: string
          supplierPaymentDiscountAccount: string
          updatedBy: string | null
          workInProgressAccount: string
        }
        Insert: {
          accumulatedDepreciationAccount: string
          accumulatedDepreciationOnDisposalAccount: string
          assetAquisitionCostAccount: string
          assetAquisitionCostOnDisposalAccount: string
          assetDepreciationExpenseAccount: string
          assetGainsAndLossesAccount: string
          bankCashAccount: string
          bankForeignCurrencyAccount: string
          bankLocalCurrencyAccount: string
          capacityVarianceAccount: string
          costOfGoodsSoldAccount: string
          customerPaymentDiscountAccount: string
          directCostAppliedAccount: string
          id?: boolean
          interestAccount: string
          inventoryAccount: string
          inventoryAdjustmentVarianceAccount: string
          inventoryInterimAccrualAccount: string
          inventoryReceivedNotInvoicedAccount: string
          inventoryShippedNotInvoicedAccount: string
          maintenanceAccount: string
          materialVarianceAccount: string
          overheadAccount: string
          overheadCostAppliedAccount: string
          payablesAccount: string
          prepaymentAccount: string
          purchaseAccount: string
          purchaseTaxPayableAccount: string
          purchaseVarianceAccount: string
          receivablesAccount: string
          retainedEarningsAccount: string
          reverseChargeSalesTaxPayableAccount: string
          roundingAccount: string
          salesAccount: string
          salesDiscountAccount: string
          salesTaxPayableAccount: string
          serviceChargeAccount: string
          supplierPaymentDiscountAccount: string
          updatedBy?: string | null
          workInProgressAccount: string
        }
        Update: {
          accumulatedDepreciationAccount?: string
          accumulatedDepreciationOnDisposalAccount?: string
          assetAquisitionCostAccount?: string
          assetAquisitionCostOnDisposalAccount?: string
          assetDepreciationExpenseAccount?: string
          assetGainsAndLossesAccount?: string
          bankCashAccount?: string
          bankForeignCurrencyAccount?: string
          bankLocalCurrencyAccount?: string
          capacityVarianceAccount?: string
          costOfGoodsSoldAccount?: string
          customerPaymentDiscountAccount?: string
          directCostAppliedAccount?: string
          id?: boolean
          interestAccount?: string
          inventoryAccount?: string
          inventoryAdjustmentVarianceAccount?: string
          inventoryInterimAccrualAccount?: string
          inventoryReceivedNotInvoicedAccount?: string
          inventoryShippedNotInvoicedAccount?: string
          maintenanceAccount?: string
          materialVarianceAccount?: string
          overheadAccount?: string
          overheadCostAppliedAccount?: string
          payablesAccount?: string
          prepaymentAccount?: string
          purchaseAccount?: string
          purchaseTaxPayableAccount?: string
          purchaseVarianceAccount?: string
          receivablesAccount?: string
          retainedEarningsAccount?: string
          reverseChargeSalesTaxPayableAccount?: string
          roundingAccount?: string
          salesAccount?: string
          salesDiscountAccount?: string
          salesTaxPayableAccount?: string
          serviceChargeAccount?: string
          supplierPaymentDiscountAccount?: string
          updatedBy?: string | null
          workInProgressAccount?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountDefault_accumulatedDepreciationAccount_fkey"
            columns: ["accumulatedDepreciationAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_accumulatedDepreciationAccount_fkey"
            columns: ["accumulatedDepreciationAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_accumulatedDepreciationOnDisposalAccount_fkey"
            columns: ["accumulatedDepreciationOnDisposalAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_accumulatedDepreciationOnDisposalAccount_fkey"
            columns: ["accumulatedDepreciationOnDisposalAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_aquisitionCostAccount_fkey"
            columns: ["assetAquisitionCostAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_aquisitionCostAccount_fkey"
            columns: ["assetAquisitionCostAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_aquisitionCostOnDisposalAccount_fkey"
            columns: ["assetAquisitionCostOnDisposalAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_aquisitionCostOnDisposalAccount_fkey"
            columns: ["assetAquisitionCostOnDisposalAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_assetDepreciationExpenseAccount_fkey"
            columns: ["assetDepreciationExpenseAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_assetDepreciationExpenseAccount_fkey"
            columns: ["assetDepreciationExpenseAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_assetGainsAndLossesAccount_fkey"
            columns: ["assetGainsAndLossesAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_assetGainsAndLossesAccount_fkey"
            columns: ["assetGainsAndLossesAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankCashAccount_fkey"
            columns: ["bankCashAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankCashAccount_fkey"
            columns: ["bankCashAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankForeignCurrencyAccount_fkey"
            columns: ["bankForeignCurrencyAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankForeignCurrencyAccount_fkey"
            columns: ["bankForeignCurrencyAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankLocalCurrencyAccount_fkey"
            columns: ["bankLocalCurrencyAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_bankLocalCurrencyAccount_fkey"
            columns: ["bankLocalCurrencyAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_capacityVarianceAccount_fkey"
            columns: ["capacityVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_capacityVarianceAccount_fkey"
            columns: ["capacityVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_costOfGoodsSoldAccount_fkey"
            columns: ["costOfGoodsSoldAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_costOfGoodsSoldAccount_fkey"
            columns: ["costOfGoodsSoldAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_customerPaymentDiscountAccount_fkey"
            columns: ["customerPaymentDiscountAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_customerPaymentDiscountAccount_fkey"
            columns: ["customerPaymentDiscountAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_directCostAppliedAccount_fkey"
            columns: ["directCostAppliedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_directCostAppliedAccount_fkey"
            columns: ["directCostAppliedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_interestAccount_fkey"
            columns: ["interestAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_interestAccount_fkey"
            columns: ["interestAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryAccount_fkey"
            columns: ["inventoryAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryAccount_fkey"
            columns: ["inventoryAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryAdjustmentVarianceAccount_fkey"
            columns: ["inventoryAdjustmentVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryAdjustmentVarianceAccount_fkey"
            columns: ["inventoryAdjustmentVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryInterimAccrualAccount_fkey"
            columns: ["inventoryInterimAccrualAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryInterimAccrualAccount_fkey"
            columns: ["inventoryInterimAccrualAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryReceivedNotInvoicedAccount_fkey"
            columns: ["inventoryReceivedNotInvoicedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryReceivedNotInvoicedAccount_fkey"
            columns: ["inventoryReceivedNotInvoicedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryShippedNotInvoicedAccount_fkey"
            columns: ["inventoryShippedNotInvoicedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_inventoryShippedNotInvoicedAccount_fkey"
            columns: ["inventoryShippedNotInvoicedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_maintenanceAccount_fkey"
            columns: ["maintenanceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_maintenanceAccount_fkey"
            columns: ["maintenanceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_materialVarianceAccount_fkey"
            columns: ["materialVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_materialVarianceAccount_fkey"
            columns: ["materialVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_overheadAccount_fkey"
            columns: ["overheadAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_overheadAccount_fkey"
            columns: ["overheadAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_overheadCostAppliedAccount_fkey"
            columns: ["overheadCostAppliedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_overheadCostAppliedAccount_fkey"
            columns: ["overheadCostAppliedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_payablesAccount_fkey"
            columns: ["payablesAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_payablesAccount_fkey"
            columns: ["payablesAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_prepaymentAccount_fkey"
            columns: ["prepaymentAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_prepaymentAccount_fkey"
            columns: ["prepaymentAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseAccount_fkey"
            columns: ["purchaseAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseAccount_fkey"
            columns: ["purchaseAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseTaxPayableAccount_fkey"
            columns: ["purchaseTaxPayableAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseTaxPayableAccount_fkey"
            columns: ["purchaseTaxPayableAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseVarianceAccount_fkey"
            columns: ["purchaseVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_purchaseVarianceAccount_fkey"
            columns: ["purchaseVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_receivablesAccount_fkey"
            columns: ["receivablesAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_receivablesAccount_fkey"
            columns: ["receivablesAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_retainedEarningsAccount_fkey"
            columns: ["retainedEarningsAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_retainedEarningsAccount_fkey"
            columns: ["retainedEarningsAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_reverseChargeSalesTaxPayableAccount_fkey"
            columns: ["reverseChargeSalesTaxPayableAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_reverseChargeSalesTaxPayableAccount_fkey"
            columns: ["reverseChargeSalesTaxPayableAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_roundingAccount_fkey"
            columns: ["roundingAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_roundingAccount_fkey"
            columns: ["roundingAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesAccount_fkey"
            columns: ["salesAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesAccount_fkey"
            columns: ["salesAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesDiscountAccount_fkey"
            columns: ["salesDiscountAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesDiscountAccount_fkey"
            columns: ["salesDiscountAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesTaxPayableAccount_fkey"
            columns: ["salesTaxPayableAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_salesTaxPayableAccount_fkey"
            columns: ["salesTaxPayableAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_serviceChargeAccount_fkey"
            columns: ["serviceChargeAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_serviceChargeAccount_fkey"
            columns: ["serviceChargeAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_supplierPaymentDiscountAccount_fkey"
            columns: ["supplierPaymentDiscountAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_supplierPaymentDiscountAccount_fkey"
            columns: ["supplierPaymentDiscountAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountDefault_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountDefault_workInProgressAccount_fkey"
            columns: ["workInProgressAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "accountDefault_workInProgressAccount_fkey"
            columns: ["workInProgressAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          }
        ]
      }
      accountingPeriod: {
        Row: {
          closedAt: string | null
          closedBy: string | null
          createdAt: string
          createdBy: string
          endDate: string
          id: string
          startDate: string
          status: Database["public"]["Enums"]["accountingPeriodStatus"]
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          closedAt?: string | null
          closedBy?: string | null
          createdAt?: string
          createdBy: string
          endDate: string
          id?: string
          startDate: string
          status?: Database["public"]["Enums"]["accountingPeriodStatus"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          closedAt?: string | null
          closedBy?: string | null
          createdAt?: string
          createdBy?: string
          endDate?: string
          id?: string
          startDate?: string
          status?: Database["public"]["Enums"]["accountingPeriodStatus"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accountingPeriod_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountingPeriod_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountingPeriod_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountingPeriod_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountingPeriod_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountingPeriod_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      accountSubcategory: {
        Row: {
          accountCategoryId: string
          active: boolean
          createdAt: string
          createdBy: string
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountCategoryId: string
          active?: boolean
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountCategoryId?: string
          active?: boolean
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accountSubcategory_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountSubcategory_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountSubcategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountSubcategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountSubcategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountSubcategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      address: {
        Row: {
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          countryId: number | null
          fax: string | null
          id: string
          phone: string | null
          postalCode: string | null
          state: string | null
        }
        Insert: {
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          countryId?: number | null
          fax?: string | null
          id?: string
          phone?: string | null
          postalCode?: string | null
          state?: string | null
        }
        Update: {
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          countryId?: number | null
          fax?: string | null
          id?: string
          phone?: string | null
          postalCode?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "address_countryId_fkey"
            columns: ["countryId"]
            referencedRelation: "country"
            referencedColumns: ["id"]
          }
        ]
      }
      attributeDataType: {
        Row: {
          id: number
          isBoolean: boolean
          isDate: boolean
          isList: boolean
          isNumeric: boolean
          isText: boolean
          isUser: boolean
          label: string
        }
        Insert: {
          id?: number
          isBoolean?: boolean
          isDate?: boolean
          isList?: boolean
          isNumeric?: boolean
          isText?: boolean
          isUser?: boolean
          label: string
        }
        Update: {
          id?: number
          isBoolean?: boolean
          isDate?: boolean
          isList?: boolean
          isNumeric?: boolean
          isText?: boolean
          isUser?: boolean
          label?: string
        }
        Relationships: []
      }
      contact: {
        Row: {
          addressLine1: string | null
          addressLine2: string | null
          birthday: string | null
          city: string | null
          countryId: number | null
          email: string
          fax: string | null
          firstName: string
          fullName: string | null
          homePhone: string | null
          id: string
          lastName: string
          mobilePhone: string | null
          notes: string | null
          postalCode: string | null
          state: string | null
          title: string | null
          workPhone: string | null
        }
        Insert: {
          addressLine1?: string | null
          addressLine2?: string | null
          birthday?: string | null
          city?: string | null
          countryId?: number | null
          email: string
          fax?: string | null
          firstName: string
          fullName?: string | null
          homePhone?: string | null
          id?: string
          lastName: string
          mobilePhone?: string | null
          notes?: string | null
          postalCode?: string | null
          state?: string | null
          title?: string | null
          workPhone?: string | null
        }
        Update: {
          addressLine1?: string | null
          addressLine2?: string | null
          birthday?: string | null
          city?: string | null
          countryId?: number | null
          email?: string
          fax?: string | null
          firstName?: string
          fullName?: string | null
          homePhone?: string | null
          id?: string
          lastName?: string
          mobilePhone?: string | null
          notes?: string | null
          postalCode?: string | null
          state?: string | null
          title?: string | null
          workPhone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_countryId_fkey"
            columns: ["countryId"]
            referencedRelation: "country"
            referencedColumns: ["id"]
          }
        ]
      }
      contractor: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          hoursPerWeek: number
          id: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          hoursPerWeek?: number
          id: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          hoursPerWeek?: number
          id?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "contractor_id_fkey"
            columns: ["id"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      contractorAbility: {
        Row: {
          abilityId: string
          contractorId: string
          createdAt: string
          createdBy: string
        }
        Insert: {
          abilityId: string
          contractorId: string
          createdAt?: string
          createdBy: string
        }
        Update: {
          abilityId?: string
          contractorId?: string
          createdAt?: string
          createdBy?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractorAbility_abilityId_fkey"
            columns: ["abilityId"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractorAbility_contractorId_fkey"
            columns: ["contractorId"]
            referencedRelation: "contractor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractorAbility_contractorId_fkey"
            columns: ["contractorId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierContactId"]
          },
          {
            foreignKeyName: "contractorAbility_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractorAbility_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      country: {
        Row: {
          code: string
          id: number
          name: string
        }
        Insert: {
          code: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      crew: {
        Row: {
          crewLeaderId: string | null
          description: string | null
          groupId: string
          id: string
          name: string
          workCellId: string | null
        }
        Insert: {
          crewLeaderId?: string | null
          description?: string | null
          groupId: string
          id?: string
          name: string
          workCellId?: string | null
        }
        Update: {
          crewLeaderId?: string | null
          description?: string | null
          groupId?: string
          id?: string
          name?: string
          workCellId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_crewLeaderId_fkey"
            columns: ["crewLeaderId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_crewLeaderId_fkey"
            columns: ["crewLeaderId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "crew_groupId_fkey"
            columns: ["groupId"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_workCellId_fkey"
            columns: ["workCellId"]
            referencedRelation: "workCell"
            referencedColumns: ["id"]
          }
        ]
      }
      crewAbility: {
        Row: {
          abilityId: string
          active: boolean
          crewId: string
          id: string
        }
        Insert: {
          abilityId: string
          active?: boolean
          crewId: string
          id?: string
        }
        Update: {
          abilityId?: string
          active?: boolean
          crewId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crewAbility_abilityId_fkey"
            columns: ["abilityId"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crewAbility_crewId_fkey"
            columns: ["crewId"]
            referencedRelation: "crew"
            referencedColumns: ["id"]
          }
        ]
      }
      currency: {
        Row: {
          active: boolean
          code: string
          createdAt: string
          createdBy: string
          exchangeRate: number
          id: string
          isBaseCurrency: boolean
          name: string
          symbol: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          code: string
          createdAt?: string
          createdBy: string
          exchangeRate?: number
          id?: string
          isBaseCurrency?: boolean
          name: string
          symbol?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          createdAt?: string
          createdBy?: string
          exchangeRate?: number
          id?: string
          isBaseCurrency?: boolean
          name?: string
          symbol?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "currency_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "currency_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "currency_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "currency_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      customer: {
        Row: {
          accountManagerId: string | null
          createdAt: string
          createdBy: string | null
          customerStatusId: string | null
          customerTypeId: string | null
          defaultCurrencyCode: string | null
          defaultPaymentTermId: string | null
          defaultShippingMethodId: string | null
          defaultShippingTermId: string | null
          id: string
          logo: string | null
          name: string
          taxId: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountManagerId?: string | null
          createdAt?: string
          createdBy?: string | null
          customerStatusId?: string | null
          customerTypeId?: string | null
          defaultCurrencyCode?: string | null
          defaultPaymentTermId?: string | null
          defaultShippingMethodId?: string | null
          defaultShippingTermId?: string | null
          id?: string
          logo?: string | null
          name: string
          taxId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountManagerId?: string | null
          createdAt?: string
          createdBy?: string | null
          customerStatusId?: string | null
          customerTypeId?: string | null
          defaultCurrencyCode?: string | null
          defaultPaymentTermId?: string | null
          defaultShippingMethodId?: string | null
          defaultShippingTermId?: string | null
          id?: string
          logo?: string | null
          name?: string
          taxId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_accountManagerId_fkey"
            columns: ["accountManagerId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_accountManagerId_fkey"
            columns: ["accountManagerId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "customer_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "customer_customerStatusId_fkey"
            columns: ["customerStatusId"]
            referencedRelation: "customerStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_customerTypeId_fkey"
            columns: ["customerTypeId"]
            referencedRelation: "customerType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_defaultPaymentTermId_fkey"
            columns: ["defaultPaymentTermId"]
            referencedRelation: "paymentTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_defaultShippingMethodId_fkey"
            columns: ["defaultShippingMethodId"]
            referencedRelation: "shippingMethod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_defaultShippingTermId_fkey"
            columns: ["defaultShippingTermId"]
            referencedRelation: "shippingTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      customerAccount: {
        Row: {
          customerId: string
          id: string
        }
        Insert: {
          customerId: string
          id: string
        }
        Update: {
          customerId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customerAccount_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerAccount_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerAccount_id_fkey"
            columns: ["id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerAccount_id_fkey"
            columns: ["id"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      customerContact: {
        Row: {
          contactId: string
          customerId: string
          customerLocationId: string | null
          id: string
          userId: string | null
        }
        Insert: {
          contactId: string
          customerId: string
          customerLocationId?: string | null
          id?: string
          userId?: string | null
        }
        Update: {
          contactId?: string
          customerId?: string
          customerLocationId?: string | null
          id?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customerContact_contactId_fkey"
            columns: ["contactId"]
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerContact_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerContact_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerContact_customerLocationId_fkey"
            columns: ["customerLocationId"]
            referencedRelation: "customerLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerContact_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerContact_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      customerLocation: {
        Row: {
          addressId: string
          customerId: string
          id: string
        }
        Insert: {
          addressId: string
          customerId: string
          id?: string
        }
        Update: {
          addressId?: string
          customerId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customerLocation_addressId_fkey"
            columns: ["addressId"]
            referencedRelation: "address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerLocation_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerLocation_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      customerStatus: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      customerType: {
        Row: {
          color: string | null
          createdAt: string
          createdBy: string
          id: string
          name: string
          protected: boolean
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          color?: string | null
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          protected?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          color?: string | null
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          protected?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customerType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "customerType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customerType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      department: {
        Row: {
          color: string
          createdAt: string
          createdBy: string
          id: string
          name: string
          parentDepartmentId: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          color?: string
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          parentDepartmentId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          color?: string
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          parentDepartmentId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_parentDepartmentId_fkey"
            columns: ["parentDepartmentId"]
            referencedRelation: "department"
            referencedColumns: ["id"]
          }
        ]
      }
      document: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          description: string | null
          id: string
          name: string
          path: string
          readGroups: string[] | null
          size: number
          type: string | null
          updatedAt: string | null
          updatedBy: string | null
          writeGroups: string[] | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          description?: string | null
          id?: string
          name: string
          path: string
          readGroups?: string[] | null
          size: number
          type?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
          writeGroups?: string[] | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          description?: string | null
          id?: string
          name?: string
          path?: string
          readGroups?: string[] | null
          size?: number
          type?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
          writeGroups?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "document_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "document_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      documentFavorite: {
        Row: {
          documentId: string
          userId: string
        }
        Insert: {
          documentId: string
          userId: string
        }
        Update: {
          documentId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentFavorites_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentFavorites_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentFavorites_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentFavorites_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      documentLabel: {
        Row: {
          documentId: string
          label: string
          userId: string
        }
        Insert: {
          documentId: string
          label: string
          userId: string
        }
        Update: {
          documentId?: string
          label?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentLabels_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentLabels_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentLabels_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentLabels_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      documentTransaction: {
        Row: {
          createdAt: string
          documentId: string
          id: string
          type: Database["public"]["Enums"]["documentTransactionType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          documentId: string
          id?: string
          type: Database["public"]["Enums"]["documentTransactionType"]
          userId: string
        }
        Update: {
          createdAt?: string
          documentId?: string
          id?: string
          type?: Database["public"]["Enums"]["documentTransactionType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentTransaction_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentTransaction_documentId_fkey"
            columns: ["documentId"]
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentTransaction_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentTransaction_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      employee: {
        Row: {
          employeeTypeId: string
          id: string
        }
        Insert: {
          employeeTypeId: string
          id: string
        }
        Update: {
          employeeTypeId?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_employeeTypeId_fkey"
            columns: ["employeeTypeId"]
            referencedRelation: "employeeType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_id_fkey"
            columns: ["id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_id_fkey"
            columns: ["id"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      employeeAbility: {
        Row: {
          abilityId: string
          active: boolean
          employeeId: string
          id: string
          lastTrainingDate: string | null
          trainingCompleted: boolean | null
          trainingDays: number
        }
        Insert: {
          abilityId: string
          active?: boolean
          employeeId: string
          id?: string
          lastTrainingDate?: string | null
          trainingCompleted?: boolean | null
          trainingDays?: number
        }
        Update: {
          abilityId?: string
          active?: boolean
          employeeId?: string
          id?: string
          lastTrainingDate?: string | null
          trainingCompleted?: boolean | null
          trainingDays?: number
        }
        Relationships: [
          {
            foreignKeyName: "employeeAbilities_abilityId_fkey"
            columns: ["abilityId"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeAbilities_employeeId_fkey"
            columns: ["employeeId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeAbilities_employeeId_fkey"
            columns: ["employeeId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      employeeJob: {
        Row: {
          departmentId: string | null
          id: string
          locationId: string | null
          managerId: string | null
          shiftId: string | null
          startDate: string | null
          title: string | null
          workCellId: string | null
        }
        Insert: {
          departmentId?: string | null
          id: string
          locationId?: string | null
          managerId?: string | null
          shiftId?: string | null
          startDate?: string | null
          title?: string | null
          workCellId?: string | null
        }
        Update: {
          departmentId?: string | null
          id?: string
          locationId?: string | null
          managerId?: string | null
          shiftId?: string | null
          startDate?: string | null
          title?: string | null
          workCellId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employeeJob_departmentId_fkey"
            columns: ["departmentId"]
            referencedRelation: "department"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_id_fkey"
            columns: ["id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_id_fkey"
            columns: ["id"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "employeeJob_managerId_fkey"
            columns: ["managerId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_managerId_fkey"
            columns: ["managerId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "employeeJob_shiftId_fkey"
            columns: ["shiftId"]
            referencedRelation: "shift"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_workCellId_fkey"
            columns: ["workCellId"]
            referencedRelation: "workCell"
            referencedColumns: ["id"]
          }
        ]
      }
      employeeShift: {
        Row: {
          employeeId: string
          id: string
          shiftId: string
        }
        Insert: {
          employeeId: string
          id?: string
          shiftId: string
        }
        Update: {
          employeeId?: string
          id?: string
          shiftId?: string
        }
        Relationships: [
          {
            foreignKeyName: "employeeShift_employeeId_fkey"
            columns: ["employeeId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeShift_employeeId_fkey"
            columns: ["employeeId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "employeeShift_shiftId_fkey"
            columns: ["shiftId"]
            referencedRelation: "shift"
            referencedColumns: ["id"]
          }
        ]
      }
      employeeType: {
        Row: {
          color: string
          createdAt: string
          id: string
          name: string
          protected: boolean
          updatedAt: string | null
        }
        Insert: {
          color?: string
          createdAt?: string
          id?: string
          name: string
          protected?: boolean
          updatedAt?: string | null
        }
        Update: {
          color?: string
          createdAt?: string
          id?: string
          name?: string
          protected?: boolean
          updatedAt?: string | null
        }
        Relationships: []
      }
      employeeTypePermission: {
        Row: {
          create: boolean
          createdAt: string
          delete: boolean
          employeeTypeId: string
          featureId: string
          update: boolean
          updatedAt: string | null
          view: boolean
        }
        Insert: {
          create?: boolean
          createdAt?: string
          delete?: boolean
          employeeTypeId: string
          featureId: string
          update?: boolean
          updatedAt?: string | null
          view?: boolean
        }
        Update: {
          create?: boolean
          createdAt?: string
          delete?: boolean
          employeeTypeId?: string
          featureId?: string
          update?: boolean
          updatedAt?: string | null
          view?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "employeeTypePermission_employeeTypeId_fkey"
            columns: ["employeeTypeId"]
            referencedRelation: "employeeType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeTypePermission_featureId_fkey"
            columns: ["featureId"]
            referencedRelation: "feature"
            referencedColumns: ["id"]
          }
        ]
      }
      equipment: {
        Row: {
          active: boolean
          activeDate: string | null
          createdAt: string
          createdBy: string
          description: string | null
          equipmentTypeId: string
          id: string
          locationId: string
          name: string
          operatorsRequired: number
          setupHours: number
          updatedAt: string | null
          updatedBy: string | null
          workCellId: string | null
        }
        Insert: {
          active?: boolean
          activeDate?: string | null
          createdAt?: string
          createdBy: string
          description?: string | null
          equipmentTypeId: string
          id?: string
          locationId: string
          name: string
          operatorsRequired?: number
          setupHours?: number
          updatedAt?: string | null
          updatedBy?: string | null
          workCellId?: string | null
        }
        Update: {
          active?: boolean
          activeDate?: string | null
          createdAt?: string
          createdBy?: string
          description?: string | null
          equipmentTypeId?: string
          id?: string
          locationId?: string
          name?: string
          operatorsRequired?: number
          setupHours?: number
          updatedAt?: string | null
          updatedBy?: string | null
          workCellId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "equipment_equipmentTypeId_fkey"
            columns: ["equipmentTypeId"]
            referencedRelation: "equipmentType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "equipment_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "equipment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "equipment_workCellId_fkey"
            columns: ["workCellId"]
            referencedRelation: "workCell"
            referencedColumns: ["id"]
          }
        ]
      }
      equipmentType: {
        Row: {
          active: boolean
          color: string
          createdAt: string
          createdBy: string
          description: string | null
          id: string
          name: string
          requiredAbility: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          color?: string
          createdAt?: string
          createdBy: string
          description?: string | null
          id?: string
          name: string
          requiredAbility?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          color?: string
          createdAt?: string
          createdBy?: string
          description?: string | null
          id?: string
          name?: string
          requiredAbility?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipmentType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipmentType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "equipmentType_requiredAbility_fkey"
            columns: ["requiredAbility"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipmentType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipmentType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      feature: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      fiscalYearSettings: {
        Row: {
          id: boolean
          startMonth: Database["public"]["Enums"]["month"]
          taxStartMonth: Database["public"]["Enums"]["month"]
          updatedBy: string
        }
        Insert: {
          id?: boolean
          startMonth?: Database["public"]["Enums"]["month"]
          taxStartMonth?: Database["public"]["Enums"]["month"]
          updatedBy: string
        }
        Update: {
          id?: boolean
          startMonth?: Database["public"]["Enums"]["month"]
          taxStartMonth?: Database["public"]["Enums"]["month"]
          updatedBy?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscalYearSettings_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscalYearSettings_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      group: {
        Row: {
          createdAt: string
          id: string
          isCustomerOrgGroup: boolean
          isCustomerTypeGroup: boolean
          isEmployeeTypeGroup: boolean
          isIdentityGroup: boolean
          isSupplierOrgGroup: boolean
          isSupplierTypeGroup: boolean
          name: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          isCustomerOrgGroup?: boolean
          isCustomerTypeGroup?: boolean
          isEmployeeTypeGroup?: boolean
          isIdentityGroup?: boolean
          isSupplierOrgGroup?: boolean
          isSupplierTypeGroup?: boolean
          name: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          isCustomerOrgGroup?: boolean
          isCustomerTypeGroup?: boolean
          isEmployeeTypeGroup?: boolean
          isIdentityGroup?: boolean
          isSupplierOrgGroup?: boolean
          isSupplierTypeGroup?: boolean
          name?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      holiday: {
        Row: {
          createdAt: string
          createdBy: string
          date: string
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
          year: number | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          date: string
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
          year?: number | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          date?: string
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "holiday_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holiday_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "holiday_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holiday_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      journal: {
        Row: {
          accountingPeriodId: string | null
          createdAt: string
          description: string | null
          id: number
          postingDate: string
        }
        Insert: {
          accountingPeriodId?: string | null
          createdAt?: string
          description?: string | null
          id?: number
          postingDate?: string
        }
        Update: {
          accountingPeriodId?: string | null
          createdAt?: string
          description?: string | null
          id?: number
          postingDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_accountPeriodId_fkey"
            columns: ["accountingPeriodId"]
            referencedRelation: "accountingPeriod"
            referencedColumns: ["id"]
          }
        ]
      }
      journalLine: {
        Row: {
          accountNumber: string
          amount: number
          createdAt: string
          description: string | null
          documentId: string | null
          documentType:
            | Database["public"]["Enums"]["journalLineDocumentType"]
            | null
          externalDocumentId: string | null
          id: string
          journalId: number
        }
        Insert: {
          accountNumber: string
          amount: number
          createdAt?: string
          description?: string | null
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["journalLineDocumentType"]
            | null
          externalDocumentId?: string | null
          id?: string
          journalId: number
        }
        Update: {
          accountNumber?: string
          amount?: number
          createdAt?: string
          description?: string | null
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["journalLineDocumentType"]
            | null
          externalDocumentId?: string | null
          id?: string
          journalId?: number
        }
        Relationships: [
          {
            foreignKeyName: "journalLine_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "journalLine_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          }
        ]
      }
      location: {
        Row: {
          addressLine1: string
          addressLine2: string | null
          city: string
          country: string | null
          createdAt: string
          createdBy: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          postalCode: string
          state: string
          timezone: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          addressLine1: string
          addressLine2?: string | null
          city: string
          country?: string | null
          createdAt?: string
          createdBy: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          postalCode: string
          state: string
          timezone: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          addressLine1?: string
          addressLine2?: string | null
          city?: string
          country?: string | null
          createdAt?: string
          createdBy?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          postalCode?: string
          state?: string
          timezone?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: []
      }
      membership: {
        Row: {
          groupId: string
          id: number
          memberGroupId: string | null
          memberUserId: string | null
        }
        Insert: {
          groupId: string
          id?: number
          memberGroupId?: string | null
          memberUserId?: string | null
        }
        Update: {
          groupId?: string
          id?: number
          memberGroupId?: string | null
          memberUserId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_groupId_fkey"
            columns: ["groupId"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberGroupId_fkey"
            columns: ["memberGroupId"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberUserId_fkey"
            columns: ["memberUserId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberUserId_fkey"
            columns: ["memberUserId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      note: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          documentId: string
          id: string
          note: string
          noteRichText: Json
          updatedAt: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          documentId: string
          id?: string
          note: string
          noteRichText?: Json
          updatedAt?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          documentId?: string
          id?: string
          note?: string
          noteRichText?: Json
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      part: {
        Row: {
          active: boolean
          approved: boolean
          approvedBy: string | null
          blocked: boolean
          createdAt: string
          createdBy: string
          description: string | null
          fromDate: string | null
          id: string
          manufacturerPartNumber: string | null
          name: string
          partGroupId: string | null
          partType: Database["public"]["Enums"]["partType"]
          replenishmentSystem: Database["public"]["Enums"]["partReplenishmentSystem"]
          toDate: string | null
          unitOfMeasureCode: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          approved?: boolean
          approvedBy?: string | null
          blocked?: boolean
          createdAt?: string
          createdBy: string
          description?: string | null
          fromDate?: string | null
          id: string
          manufacturerPartNumber?: string | null
          name: string
          partGroupId?: string | null
          partType: Database["public"]["Enums"]["partType"]
          replenishmentSystem: Database["public"]["Enums"]["partReplenishmentSystem"]
          toDate?: string | null
          unitOfMeasureCode: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          approved?: boolean
          approvedBy?: string | null
          blocked?: boolean
          createdAt?: string
          createdBy?: string
          description?: string | null
          fromDate?: string | null
          id?: string
          manufacturerPartNumber?: string | null
          name?: string
          partGroupId?: string | null
          partType?: Database["public"]["Enums"]["partType"]
          replenishmentSystem?: Database["public"]["Enums"]["partReplenishmentSystem"]
          toDate?: string | null
          unitOfMeasureCode?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "part_approvedBy_fkey"
            columns: ["approvedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_approvedBy_fkey"
            columns: ["approvedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "part_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "part_partGroupId_fkey"
            columns: ["partGroupId"]
            referencedRelation: "partGroup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_unitOfMeasureCode_fkey"
            columns: ["unitOfMeasureCode"]
            referencedRelation: "unitOfMeasure"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "part_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partCost: {
        Row: {
          costingMethod: Database["public"]["Enums"]["partCostingMethod"]
          costIsAdjusted: boolean
          createdAt: string
          createdBy: string
          partId: string
          standardCost: number
          unitCost: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          costingMethod: Database["public"]["Enums"]["partCostingMethod"]
          costIsAdjusted?: boolean
          createdAt?: string
          createdBy: string
          partId: string
          standardCost?: number
          unitCost?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          costingMethod?: Database["public"]["Enums"]["partCostingMethod"]
          costIsAdjusted?: boolean
          createdAt?: string
          createdBy?: string
          partId?: string
          standardCost?: number
          unitCost?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partCost_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partCost_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partCost_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partGroup_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partGroup_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partGroup_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partGroup_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partGroup: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          description: string | null
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          description?: string | null
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          description?: string | null
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partGroup_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partGroup_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partGroup_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partGroup_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partInventory: {
        Row: {
          createdAt: string
          createdBy: string
          defaultShelfId: string | null
          locationId: string
          partId: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          defaultShelfId?: string | null
          locationId: string
          partId: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          defaultShelfId?: string | null
          locationId?: string
          partId?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partInventory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partInventory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partInventory_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partInventory_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partInventory_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partInventory_shelfId_fkey"
            columns: ["defaultShelfId", "locationId"]
            referencedRelation: "shelf"
            referencedColumns: ["id", "locationId"]
          },
          {
            foreignKeyName: "partInventory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partInventory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partLedger: {
        Row: {
          createdAt: string
          documentId: string | null
          documentType:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber: number
          entryType: Database["public"]["Enums"]["partLedgerType"]
          externalDocumentId: string | null
          id: string
          locationId: string | null
          partId: string
          postingDate: string
          quantity: number
          shelfId: string | null
        }
        Insert: {
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber?: number
          entryType: Database["public"]["Enums"]["partLedgerType"]
          externalDocumentId?: string | null
          id?: string
          locationId?: string | null
          partId: string
          postingDate?: string
          quantity: number
          shelfId?: string | null
        }
        Update: {
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber?: number
          entryType?: Database["public"]["Enums"]["partLedgerType"]
          externalDocumentId?: string | null
          id?: string
          locationId?: string | null
          partId?: string
          postingDate?: string
          quantity?: number
          shelfId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partLedger_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partLedger_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partLedger_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partLedger_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partLedger_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partLedger_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partLedger_shelfId_fkey"
            columns: ["shelfId", "locationId"]
            referencedRelation: "shelf"
            referencedColumns: ["id", "locationId"]
          }
        ]
      }
      partLedgerValueLedgerRelation: {
        Row: {
          partLedgerId: string
          valueLedgerId: string
        }
        Insert: {
          partLedgerId: string
          valueLedgerId: string
        }
        Update: {
          partLedgerId?: string
          valueLedgerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "partLedgerValueLedgerRelation_partLedgerId_fkey"
            columns: ["partLedgerId"]
            referencedRelation: "partLedger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partLedgerValueLedgerRelation_valueLedgerId_fkey"
            columns: ["valueLedgerId"]
            referencedRelation: "valueLedger"
            referencedColumns: ["id"]
          }
        ]
      }
      partner: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          hoursPerWeek: number
          id: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          hoursPerWeek?: number
          id: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          hoursPerWeek?: number
          id?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partner_id_fkey"
            columns: ["id"]
            referencedRelation: "supplierLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partnerAbility: {
        Row: {
          abilityId: string
          createdAt: string
          createdBy: string
          partnerId: string
        }
        Insert: {
          abilityId: string
          createdAt?: string
          createdBy: string
          partnerId: string
        }
        Update: {
          abilityId?: string
          createdAt?: string
          createdBy?: string
          partnerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnerAbility_abilityId_fkey"
            columns: ["abilityId"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerAbility_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerAbility_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partnerAbility_partnerId_fkey"
            columns: ["partnerId"]
            referencedRelation: "partner"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnerAbility_partnerId_fkey"
            columns: ["partnerId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierLocationId"]
          }
        ]
      }
      partPlanning: {
        Row: {
          createdAt: string
          createdBy: string
          critical: boolean
          demandAccumulationIncludesInventory: boolean
          demandAccumulationPeriod: number
          demandReschedulingPeriod: number
          locationId: string
          maximumOrderQuantity: number
          minimumOrderQuantity: number
          orderMultiple: number
          partId: string
          reorderingPolicy: Database["public"]["Enums"]["partReorderingPolicy"]
          reorderMaximumInventory: number
          reorderPoint: number
          reorderQuantity: number
          safetyStockLeadTime: number
          safetyStockQuantity: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          critical?: boolean
          demandAccumulationIncludesInventory?: boolean
          demandAccumulationPeriod?: number
          demandReschedulingPeriod?: number
          locationId: string
          maximumOrderQuantity?: number
          minimumOrderQuantity?: number
          orderMultiple?: number
          partId: string
          reorderingPolicy?: Database["public"]["Enums"]["partReorderingPolicy"]
          reorderMaximumInventory?: number
          reorderPoint?: number
          reorderQuantity?: number
          safetyStockLeadTime?: number
          safetyStockQuantity?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          critical?: boolean
          demandAccumulationIncludesInventory?: boolean
          demandAccumulationPeriod?: number
          demandReschedulingPeriod?: number
          locationId?: string
          maximumOrderQuantity?: number
          minimumOrderQuantity?: number
          orderMultiple?: number
          partId?: string
          reorderingPolicy?: Database["public"]["Enums"]["partReorderingPolicy"]
          reorderMaximumInventory?: number
          reorderPoint?: number
          reorderQuantity?: number
          safetyStockLeadTime?: number
          safetyStockQuantity?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partPlanning_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partPlanning_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partPlanning_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partPlanning_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partPlanning_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "partPlanning_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partPlanning_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partPlanning_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partPlanning_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partPlanning_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partReplenishment: {
        Row: {
          conversionFactor: number
          createdAt: string
          createdBy: string
          lotSize: number | null
          manufacturingBlocked: boolean
          manufacturingLeadTime: number
          manufacturingPolicy: Database["public"]["Enums"]["partManufacturingPolicy"]
          partId: string
          preferredSupplierId: string | null
          purchasingBlocked: boolean
          purchasingLeadTime: number
          purchasingUnitOfMeasureCode: string | null
          requiresConfiguration: boolean
          scrapPercentage: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          conversionFactor?: number
          createdAt?: string
          createdBy: string
          lotSize?: number | null
          manufacturingBlocked?: boolean
          manufacturingLeadTime?: number
          manufacturingPolicy?: Database["public"]["Enums"]["partManufacturingPolicy"]
          partId: string
          preferredSupplierId?: string | null
          purchasingBlocked?: boolean
          purchasingLeadTime?: number
          purchasingUnitOfMeasureCode?: string | null
          requiresConfiguration?: boolean
          scrapPercentage?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          conversionFactor?: number
          createdAt?: string
          createdBy?: string
          lotSize?: number | null
          manufacturingBlocked?: boolean
          manufacturingLeadTime?: number
          manufacturingPolicy?: Database["public"]["Enums"]["partManufacturingPolicy"]
          partId?: string
          preferredSupplierId?: string | null
          purchasingBlocked?: boolean
          purchasingLeadTime?: number
          purchasingUnitOfMeasureCode?: string | null
          requiresConfiguration?: boolean
          scrapPercentage?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partReplenishment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partReplenishment_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partReplenishment_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_preferredSupplierId_fkey"
            columns: ["preferredSupplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_preferredSupplierId_fkey"
            columns: ["preferredSupplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "partReplenishment_preferredSupplierId_fkey"
            columns: ["preferredSupplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "partReplenishment_preferredSupplierId_fkey"
            columns: ["preferredSupplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_preferredSupplierId_fkey"
            columns: ["preferredSupplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_purchaseUnitOfMeasureCode_fkey"
            columns: ["purchasingUnitOfMeasureCode"]
            referencedRelation: "unitOfMeasure"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "partReplenishment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partReplenishment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partSupplier: {
        Row: {
          active: boolean
          conversionFactor: number
          createdAt: string
          createdBy: string
          id: string
          minimumOrderQuantity: number | null
          partId: string
          supplierId: string
          supplierPartId: string | null
          supplierUnitOfMeasureCode: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          conversionFactor?: number
          createdAt?: string
          createdBy: string
          id?: string
          minimumOrderQuantity?: number | null
          partId: string
          supplierId: string
          supplierPartId?: string | null
          supplierUnitOfMeasureCode?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          conversionFactor?: number
          createdAt?: string
          createdBy?: string
          id?: string
          minimumOrderQuantity?: number | null
          partId?: string
          supplierId?: string
          supplierPartId?: string | null
          supplierUnitOfMeasureCode?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partSupplier_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partSupplier_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partSupplier_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "partSupplier_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "partSupplier_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partSupplier_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      partUnitSalePrice: {
        Row: {
          allowInvoiceDiscount: boolean
          createdAt: string
          createdBy: string
          currencyCode: string
          partId: string
          priceIncludesTax: boolean
          salesBlocked: boolean
          salesUnitOfMeasureCode: string | null
          unitSalePrice: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          allowInvoiceDiscount?: boolean
          createdAt?: string
          createdBy: string
          currencyCode: string
          partId: string
          priceIncludesTax?: boolean
          salesBlocked?: boolean
          salesUnitOfMeasureCode?: string | null
          unitSalePrice?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          allowInvoiceDiscount?: boolean
          createdAt?: string
          createdBy?: string
          currencyCode?: string
          partId?: string
          priceIncludesTax?: boolean
          salesBlocked?: boolean
          salesUnitOfMeasureCode?: string | null
          unitSalePrice?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partUnitSalePrice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partUnitSalePrice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "partUnitSalePrice_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "partUnitSalePrice_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partUnitSalePrice_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "partUnitSalePrice_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partUnitSalePrice_salesUnitOfMeasureId_fkey"
            columns: ["salesUnitOfMeasureCode"]
            referencedRelation: "unitOfMeasure"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "partUnitSalePrice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partUnitSalePrice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      paymentTerm: {
        Row: {
          active: boolean
          calculationMethod: Database["public"]["Enums"]["paymentTermCalculationMethod"]
          createdAt: string
          createdBy: string
          daysDiscount: number
          daysDue: number
          discountPercentage: number
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          calculationMethod?: Database["public"]["Enums"]["paymentTermCalculationMethod"]
          createdAt?: string
          createdBy: string
          daysDiscount?: number
          daysDue?: number
          discountPercentage?: number
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          calculationMethod?: Database["public"]["Enums"]["paymentTermCalculationMethod"]
          createdAt?: string
          createdBy?: string
          daysDiscount?: number
          daysDue?: number
          discountPercentage?: number
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paymentTerm_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paymentTerm_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "paymentTerm_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paymentTerm_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      postingGroupInventory: {
        Row: {
          capacityVarianceAccount: string
          costOfGoodsSoldAccount: string
          directCostAppliedAccount: string
          id: string
          inventoryAccount: string
          inventoryAdjustmentVarianceAccount: string
          inventoryInterimAccrualAccount: string
          inventoryReceivedNotInvoicedAccount: string
          inventoryShippedNotInvoicedAccount: string
          locationId: string | null
          materialVarianceAccount: string
          overheadAccount: string
          overheadCostAppliedAccount: string
          partGroupId: string | null
          purchaseVarianceAccount: string
          updatedBy: string | null
          workInProgressAccount: string
        }
        Insert: {
          capacityVarianceAccount: string
          costOfGoodsSoldAccount: string
          directCostAppliedAccount: string
          id?: string
          inventoryAccount: string
          inventoryAdjustmentVarianceAccount: string
          inventoryInterimAccrualAccount: string
          inventoryReceivedNotInvoicedAccount: string
          inventoryShippedNotInvoicedAccount: string
          locationId?: string | null
          materialVarianceAccount: string
          overheadAccount: string
          overheadCostAppliedAccount: string
          partGroupId?: string | null
          purchaseVarianceAccount: string
          updatedBy?: string | null
          workInProgressAccount: string
        }
        Update: {
          capacityVarianceAccount?: string
          costOfGoodsSoldAccount?: string
          directCostAppliedAccount?: string
          id?: string
          inventoryAccount?: string
          inventoryAdjustmentVarianceAccount?: string
          inventoryInterimAccrualAccount?: string
          inventoryReceivedNotInvoicedAccount?: string
          inventoryShippedNotInvoicedAccount?: string
          locationId?: string | null
          materialVarianceAccount?: string
          overheadAccount?: string
          overheadCostAppliedAccount?: string
          partGroupId?: string | null
          purchaseVarianceAccount?: string
          updatedBy?: string | null
          workInProgressAccount?: string
        }
        Relationships: [
          {
            foreignKeyName: "postingGroupInventory_capacityVarianceAccount_fkey"
            columns: ["capacityVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_capacityVarianceAccount_fkey"
            columns: ["capacityVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_costOfGoodsSoldAccount_fkey"
            columns: ["costOfGoodsSoldAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_costOfGoodsSoldAccount_fkey"
            columns: ["costOfGoodsSoldAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_directCostAppliedAccount_fkey"
            columns: ["directCostAppliedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_directCostAppliedAccount_fkey"
            columns: ["directCostAppliedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryAccount_fkey"
            columns: ["inventoryAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryAccount_fkey"
            columns: ["inventoryAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryAdjustmentVarianceAccount_fkey"
            columns: ["inventoryAdjustmentVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryAdjustmentVarianceAccount_fkey"
            columns: ["inventoryAdjustmentVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryInterimAccrualAccount_fkey"
            columns: ["inventoryInterimAccrualAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryInterimAccrualAccount_fkey"
            columns: ["inventoryInterimAccrualAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryReceivedNotInvoicedAccount_fkey"
            columns: ["inventoryReceivedNotInvoicedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryReceivedNotInvoicedAccount_fkey"
            columns: ["inventoryReceivedNotInvoicedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryShippedNotInvoicedAccount_fkey"
            columns: ["inventoryShippedNotInvoicedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_inventoryShippedNotInvoicedAccount_fkey"
            columns: ["inventoryShippedNotInvoicedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "postingGroupInventory_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "postingGroupInventory_materialVarianceAccount_fkey"
            columns: ["materialVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_materialVarianceAccount_fkey"
            columns: ["materialVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_overheadAccount_fkey"
            columns: ["overheadAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_overheadAccount_fkey"
            columns: ["overheadAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_overheadCostAppliedAccount_fkey"
            columns: ["overheadCostAppliedAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_overheadCostAppliedAccount_fkey"
            columns: ["overheadCostAppliedAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_partGroupId_fkey"
            columns: ["partGroupId"]
            referencedRelation: "partGroup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupInventory_purchaseVarianceAccount_fkey"
            columns: ["purchaseVarianceAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_purchaseVarianceAccount_fkey"
            columns: ["purchaseVarianceAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupInventory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "postingGroupInventory_workInProgressAccount_fkey"
            columns: ["workInProgressAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupInventory_workInProgressAccount_fkey"
            columns: ["workInProgressAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          }
        ]
      }
      postingGroupPurchasing: {
        Row: {
          id: string
          partGroupId: string | null
          purchaseAccount: string
          purchaseCreditAccount: string
          purchaseDiscountAccount: string
          purchasePrepaymentAccount: string
          purchaseTaxPayableAccount: string
          supplierTypeId: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          partGroupId?: string | null
          purchaseAccount: string
          purchaseCreditAccount: string
          purchaseDiscountAccount: string
          purchasePrepaymentAccount: string
          purchaseTaxPayableAccount: string
          supplierTypeId?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          partGroupId?: string | null
          purchaseAccount?: string
          purchaseCreditAccount?: string
          purchaseDiscountAccount?: string
          purchasePrepaymentAccount?: string
          purchaseTaxPayableAccount?: string
          supplierTypeId?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postingGroupPurchasing_partGroupId_fkey"
            columns: ["partGroupId"]
            referencedRelation: "partGroup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseAccount_fkey"
            columns: ["purchaseAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseAccount_fkey"
            columns: ["purchaseAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseCreditAccount_fkey"
            columns: ["purchaseCreditAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseCreditAccount_fkey"
            columns: ["purchaseCreditAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseDiscountAccount_fkey"
            columns: ["purchaseDiscountAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseDiscountAccount_fkey"
            columns: ["purchaseDiscountAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchasePrepaymentAccount_fkey"
            columns: ["purchasePrepaymentAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchasePrepaymentAccount_fkey"
            columns: ["purchasePrepaymentAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseTaxPayableAccount_fkey"
            columns: ["purchaseTaxPayableAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_purchaseTaxPayableAccount_fkey"
            columns: ["purchaseTaxPayableAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_supplierTypeId_fkey"
            columns: ["supplierTypeId"]
            referencedRelation: "supplierType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupPurchasing_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      postingGroupSales: {
        Row: {
          customerTypeId: string | null
          id: string
          partGroupId: string | null
          salesAccount: string
          salesCreditAccount: string
          salesDiscountAccount: string
          salesPrepaymentAccount: string
          salesTaxPayableAccount: string
          updatedBy: string | null
        }
        Insert: {
          customerTypeId?: string | null
          id?: string
          partGroupId?: string | null
          salesAccount: string
          salesCreditAccount: string
          salesDiscountAccount: string
          salesPrepaymentAccount: string
          salesTaxPayableAccount: string
          updatedBy?: string | null
        }
        Update: {
          customerTypeId?: string | null
          id?: string
          partGroupId?: string | null
          salesAccount?: string
          salesCreditAccount?: string
          salesDiscountAccount?: string
          salesPrepaymentAccount?: string
          salesTaxPayableAccount?: string
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postingGroupSales_customerTypeId_fkey"
            columns: ["customerTypeId"]
            referencedRelation: "customerType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupSales_partGroupId_fkey"
            columns: ["partGroupId"]
            referencedRelation: "partGroup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupSales_salesAccount_fkey"
            columns: ["salesAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesAccount_fkey"
            columns: ["salesAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesCreditAccount_fkey"
            columns: ["salesCreditAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesCreditAccount_fkey"
            columns: ["salesCreditAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesDiscountAccount_fkey"
            columns: ["salesDiscountAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesDiscountAccount_fkey"
            columns: ["salesDiscountAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesPrepaymentAccount_fkey"
            columns: ["salesPrepaymentAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesPrepaymentAccount_fkey"
            columns: ["salesPrepaymentAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesTaxPayableAccount_fkey"
            columns: ["salesTaxPayableAccount"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_salesTaxPayableAccount_fkey"
            columns: ["salesTaxPayableAccount"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "postingGroupSales_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postingGroupSales_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseInvoice: {
        Row: {
          balance: number
          createdAt: string
          createdBy: string
          currencyCode: string
          dateDue: string | null
          dateIssued: string | null
          datePaid: string | null
          exchangeRate: number
          id: string
          invoiceId: string
          paymentTermId: string | null
          status: Database["public"]["Enums"]["purchaseInvoiceStatus"]
          subtotal: number
          supplierContactId: string | null
          supplierId: string | null
          supplierLocationId: string | null
          supplierReference: string | null
          totalAmount: number
          totalDiscount: number
          totalTax: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          balance?: number
          createdAt?: string
          createdBy: string
          currencyCode: string
          dateDue?: string | null
          dateIssued?: string | null
          datePaid?: string | null
          exchangeRate?: number
          id?: string
          invoiceId: string
          paymentTermId?: string | null
          status?: Database["public"]["Enums"]["purchaseInvoiceStatus"]
          subtotal?: number
          supplierContactId?: string | null
          supplierId?: string | null
          supplierLocationId?: string | null
          supplierReference?: string | null
          totalAmount?: number
          totalDiscount?: number
          totalTax?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          balance?: number
          createdAt?: string
          createdBy?: string
          currencyCode?: string
          dateDue?: string | null
          dateIssued?: string | null
          datePaid?: string | null
          exchangeRate?: number
          id?: string
          invoiceId?: string
          paymentTermId?: string | null
          status?: Database["public"]["Enums"]["purchaseInvoiceStatus"]
          subtotal?: number
          supplierContactId?: string | null
          supplierId?: string | null
          supplierLocationId?: string | null
          supplierReference?: string | null
          totalAmount?: number
          totalDiscount?: number
          totalTax?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseInvoice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseInvoice_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchaseInvoice_paymentTermId_fkey"
            columns: ["paymentTermId"]
            referencedRelation: "paymentTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierContactId_fkey"
            columns: ["supplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierLocationId_fkey"
            columns: ["supplierLocationId"]
            referencedRelation: "supplierLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseInvoiceLine: {
        Row: {
          accountNumber: string | null
          assetId: string | null
          createdAt: string
          createdBy: string
          currencyCode: string
          description: string | null
          exchangeRate: number
          id: string
          invoiceId: string
          invoiceLineType: Database["public"]["Enums"]["payableLineType"]
          partId: string | null
          purchaseOrderId: string | null
          purchaseOrderLineId: string | null
          quantity: number
          totalAmount: number | null
          unitPrice: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountNumber?: string | null
          assetId?: string | null
          createdAt?: string
          createdBy: string
          currencyCode: string
          description?: string | null
          exchangeRate?: number
          id?: string
          invoiceId: string
          invoiceLineType: Database["public"]["Enums"]["payableLineType"]
          partId?: string | null
          purchaseOrderId?: string | null
          purchaseOrderLineId?: string | null
          quantity?: number
          totalAmount?: number | null
          unitPrice?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountNumber?: string | null
          assetId?: string | null
          createdAt?: string
          createdBy?: string
          currencyCode?: string
          description?: string | null
          exchangeRate?: number
          id?: string
          invoiceId?: string
          invoiceLineType?: Database["public"]["Enums"]["payableLineType"]
          partId?: string | null
          purchaseOrderId?: string | null
          purchaseOrderLineId?: string | null
          quantity?: number
          totalAmount?: number | null
          unitPrice?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseInvoiceLines_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_purchaseOrderLineId_fkey"
            columns: ["purchaseOrderLineId"]
            referencedRelation: "purchaseOrderLine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceLines_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseInvoicePaymentRelation: {
        Row: {
          id: string
          invoiceId: string
          paymentId: string
        }
        Insert: {
          id?: string
          invoiceId: string
          paymentId: string
        }
        Update: {
          id?: string
          invoiceId?: string
          paymentId?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchasePayments_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayments_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayments_paymentId_fkey"
            columns: ["paymentId"]
            referencedRelation: "purchasePayment"
            referencedColumns: ["id"]
          }
        ]
      }
      purchaseInvoicePriceChange: {
        Row: {
          id: string
          invoiceId: string
          invoiceLineId: string
          newPrice: number
          newQuantity: number
          previousPrice: number
          previousQuantity: number
          updatedBy: string
        }
        Insert: {
          id?: string
          invoiceId: string
          invoiceLineId: string
          newPrice?: number
          newQuantity?: number
          previousPrice?: number
          previousQuantity?: number
          updatedBy: string
        }
        Update: {
          id?: string
          invoiceId?: string
          invoiceLineId?: string
          newPrice?: number
          newQuantity?: number
          previousPrice?: number
          previousQuantity?: number
          updatedBy?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchaseInvoicePriceChange_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoicePriceChange_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoicePriceChange_invoiceLineId_fkey"
            columns: ["invoiceLineId"]
            referencedRelation: "purchaseInvoiceLine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoicePriceChange_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoicePriceChange_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseInvoiceStatusHistory: {
        Row: {
          createdAt: string
          id: string
          invoiceId: string
          status: Database["public"]["Enums"]["purchaseInvoiceStatus"]
        }
        Insert: {
          createdAt?: string
          id?: string
          invoiceId: string
          status: Database["public"]["Enums"]["purchaseInvoiceStatus"]
        }
        Update: {
          createdAt?: string
          id?: string
          invoiceId?: string
          status?: Database["public"]["Enums"]["purchaseInvoiceStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "purchaseInvoiceStatusHistory_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoiceStatusHistory_invoiceId_fkey"
            columns: ["invoiceId"]
            referencedRelation: "purchaseInvoices"
            referencedColumns: ["id"]
          }
        ]
      }
      purchaseOrder: {
        Row: {
          closedAt: string | null
          closedBy: string | null
          createdAt: string
          createdBy: string
          id: string
          notes: string | null
          orderDate: string
          purchaseOrderId: string
          status: Database["public"]["Enums"]["purchaseOrderStatus"]
          supplierContactId: string | null
          supplierId: string
          supplierReference: string | null
          type: Database["public"]["Enums"]["purchaseOrderType"]
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          closedAt?: string | null
          closedBy?: string | null
          createdAt?: string
          createdBy: string
          id?: string
          notes?: string | null
          orderDate?: string
          purchaseOrderId: string
          status?: Database["public"]["Enums"]["purchaseOrderStatus"]
          supplierContactId?: string | null
          supplierId: string
          supplierReference?: string | null
          type: Database["public"]["Enums"]["purchaseOrderType"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          closedAt?: string | null
          closedBy?: string | null
          createdAt?: string
          createdBy?: string
          id?: string
          notes?: string | null
          orderDate?: string
          purchaseOrderId?: string
          status?: Database["public"]["Enums"]["purchaseOrderStatus"]
          supplierContactId?: string | null
          supplierId?: string
          supplierReference?: string | null
          type?: Database["public"]["Enums"]["purchaseOrderType"]
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrder_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrder_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierContactId_fkey"
            columns: ["supplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrderDelivery: {
        Row: {
          customerId: string | null
          customerLocationId: string | null
          deliveryDate: string | null
          dropShipment: boolean
          id: string
          locationId: string | null
          notes: string | null
          receiptPromisedDate: string | null
          receiptRequestedDate: string | null
          shippingMethodId: string | null
          shippingTermId: string | null
          trackingNumber: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          customerId?: string | null
          customerLocationId?: string | null
          deliveryDate?: string | null
          dropShipment?: boolean
          id: string
          locationId?: string | null
          notes?: string | null
          receiptPromisedDate?: string | null
          receiptRequestedDate?: string | null
          shippingMethodId?: string | null
          shippingTermId?: string | null
          trackingNumber?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          customerId?: string | null
          customerLocationId?: string | null
          deliveryDate?: string | null
          dropShipment?: boolean
          id?: string
          locationId?: string | null
          notes?: string | null
          receiptPromisedDate?: string | null
          receiptRequestedDate?: string | null
          shippingMethodId?: string | null
          shippingTermId?: string | null
          trackingNumber?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderDelivery_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_customerId_fkey"
            columns: ["customerId"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_customerLocationId_fkey"
            columns: ["customerLocationId"]
            referencedRelation: "customerLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_id_fkey"
            columns: ["id"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_id_fkey"
            columns: ["id"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_shippingMethodId_fkey"
            columns: ["shippingMethodId"]
            referencedRelation: "shippingMethod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_shippingTermId_fkey"
            columns: ["shippingTermId"]
            referencedRelation: "shippingTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderDelivery_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrderFavorite: {
        Row: {
          purchaseOrderId: string
          userId: string
        }
        Insert: {
          purchaseOrderId: string
          userId: string
        }
        Update: {
          purchaseOrderId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderFavorites_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderFavorites_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderFavorites_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderFavorites_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrderLine: {
        Row: {
          accountNumber: string | null
          assetId: string | null
          createdAt: string
          createdBy: string
          description: string | null
          id: string
          invoiceComplete: boolean
          locationId: string | null
          partId: string | null
          purchaseOrderId: string
          purchaseOrderLineType: Database["public"]["Enums"]["purchaseOrderLineType"]
          purchaseQuantity: number | null
          quantityInvoiced: number | null
          quantityReceived: number | null
          quantityToInvoice: number | null
          quantityToReceive: number | null
          receivedComplete: boolean
          requiresInspection: boolean
          setupPrice: number | null
          shelfId: string | null
          unitOfMeasureCode: string | null
          unitPrice: number | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountNumber?: string | null
          assetId?: string | null
          createdAt?: string
          createdBy: string
          description?: string | null
          id?: string
          invoiceComplete?: boolean
          locationId?: string | null
          partId?: string | null
          purchaseOrderId: string
          purchaseOrderLineType: Database["public"]["Enums"]["purchaseOrderLineType"]
          purchaseQuantity?: number | null
          quantityInvoiced?: number | null
          quantityReceived?: number | null
          quantityToInvoice?: number | null
          quantityToReceive?: number | null
          receivedComplete?: boolean
          requiresInspection?: boolean
          setupPrice?: number | null
          shelfId?: string | null
          unitOfMeasureCode?: string | null
          unitPrice?: number | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountNumber?: string | null
          assetId?: string | null
          createdAt?: string
          createdBy?: string
          description?: string | null
          id?: string
          invoiceComplete?: boolean
          locationId?: string | null
          partId?: string | null
          purchaseOrderId?: string
          purchaseOrderLineType?: Database["public"]["Enums"]["purchaseOrderLineType"]
          purchaseQuantity?: number | null
          quantityInvoiced?: number | null
          quantityReceived?: number | null
          quantityToInvoice?: number | null
          quantityToReceive?: number | null
          receivedComplete?: boolean
          requiresInspection?: boolean
          setupPrice?: number | null
          shelfId?: string | null
          unitOfMeasureCode?: string | null
          unitPrice?: number | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderLine_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "purchaseOrderLine_accountNumber_fkey"
            columns: ["accountNumber"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "purchaseOrderLine_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrderLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "purchaseOrderLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_shelfId_fkey"
            columns: ["shelfId", "locationId"]
            referencedRelation: "shelf"
            referencedColumns: ["id", "locationId"]
          },
          {
            foreignKeyName: "purchaseOrderLine_unitOfMeasureCode_fkey"
            columns: ["unitOfMeasureCode"]
            referencedRelation: "unitOfMeasure"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchaseOrderLine_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderLine_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrderPayment: {
        Row: {
          currencyCode: string
          id: string
          invoiceSupplierContactId: string | null
          invoiceSupplierId: string | null
          invoiceSupplierLocationId: string | null
          paymentComplete: boolean
          paymentTermId: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          currencyCode?: string
          id: string
          invoiceSupplierContactId?: string | null
          invoiceSupplierId?: string | null
          invoiceSupplierLocationId?: string | null
          paymentComplete?: boolean
          paymentTermId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          currencyCode?: string
          id?: string
          invoiceSupplierContactId?: string | null
          invoiceSupplierId?: string | null
          invoiceSupplierLocationId?: string | null
          paymentComplete?: boolean
          paymentTermId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderPayment_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_id_fkey"
            columns: ["id"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_id_fkey"
            columns: ["id"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierContactId_fkey"
            columns: ["invoiceSupplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierId_fkey"
            columns: ["invoiceSupplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierId_fkey"
            columns: ["invoiceSupplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierId_fkey"
            columns: ["invoiceSupplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierId_fkey"
            columns: ["invoiceSupplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierId_fkey"
            columns: ["invoiceSupplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_invoiceSupplierLocationId_fkey"
            columns: ["invoiceSupplierLocationId"]
            referencedRelation: "supplierLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderPayment_paymentTermId_fkey"
            columns: ["paymentTermId"]
            referencedRelation: "paymentTerm"
            referencedColumns: ["id"]
          }
        ]
      }
      purchaseOrderStatusHistory: {
        Row: {
          createdAt: string
          createdBy: string
          id: string
          purchaseOrderId: string
          status: Database["public"]["Enums"]["purchaseOrderStatus"]
        }
        Insert: {
          createdAt?: string
          createdBy: string
          id?: string
          purchaseOrderId: string
          status: Database["public"]["Enums"]["purchaseOrderStatus"]
        }
        Update: {
          createdAt?: string
          createdBy?: string
          id?: string
          purchaseOrderId?: string
          status?: Database["public"]["Enums"]["purchaseOrderStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderStatusHistory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderStatusHistory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrderStatusHistory_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderStatusHistory_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          }
        ]
      }
      purchaseOrderTransaction: {
        Row: {
          createdAt: string
          id: string
          purchaseOrderId: string
          type: Database["public"]["Enums"]["purchaseOrderTransactionType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          purchaseOrderId: string
          type: Database["public"]["Enums"]["purchaseOrderTransactionType"]
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          purchaseOrderId?: string
          type?: Database["public"]["Enums"]["purchaseOrderTransactionType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrderTransaction_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrder"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderTransaction_purchaseOrderId_fkey"
            columns: ["purchaseOrderId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderTransaction_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrderTransaction_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchasePayment: {
        Row: {
          createdAt: string
          createdBy: string
          currencyCode: string
          exchangeRate: number
          id: string
          paymentDate: string | null
          paymentId: string
          supplierId: string
          totalAmount: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          currencyCode: string
          exchangeRate?: number
          id?: string
          paymentDate?: string | null
          paymentId: string
          supplierId: string
          totalAmount?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          currencyCode?: string
          exchangeRate?: number
          id?: string
          paymentDate?: string | null
          paymentId?: string
          supplierId?: string
          totalAmount?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchasePayment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayment_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchasePayment_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchasePayment_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayment_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchasePayment_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchasePayment_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayment_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchasePayment_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      receipt: {
        Row: {
          createdAt: string
          createdBy: string
          externalDocumentId: string | null
          id: string
          invoiced: boolean | null
          locationId: string | null
          postingDate: string | null
          receiptId: string
          sourceDocument:
            | Database["public"]["Enums"]["receiptSourceDocument"]
            | null
          sourceDocumentId: string | null
          sourceDocumentReadableId: string | null
          status: Database["public"]["Enums"]["receiptStatus"]
          supplierId: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          externalDocumentId?: string | null
          id?: string
          invoiced?: boolean | null
          locationId?: string | null
          postingDate?: string | null
          receiptId: string
          sourceDocument?:
            | Database["public"]["Enums"]["receiptSourceDocument"]
            | null
          sourceDocumentId?: string | null
          sourceDocumentReadableId?: string | null
          status?: Database["public"]["Enums"]["receiptStatus"]
          supplierId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          externalDocumentId?: string | null
          id?: string
          invoiced?: boolean | null
          locationId?: string | null
          postingDate?: string | null
          receiptId?: string
          sourceDocument?:
            | Database["public"]["Enums"]["receiptSourceDocument"]
            | null
          sourceDocumentId?: string | null
          sourceDocumentReadableId?: string | null
          status?: Database["public"]["Enums"]["receiptStatus"]
          supplierId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "receipt_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "receipt_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      receiptLine: {
        Row: {
          createdAt: string
          createdBy: string
          id: string
          lineId: string | null
          locationId: string | null
          orderQuantity: number
          outstandingQuantity: number
          partId: string
          receiptId: string
          receivedQuantity: number
          shelfId: string | null
          unitOfMeasure: string
          unitPrice: number
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          id?: string
          lineId?: string | null
          locationId?: string | null
          orderQuantity: number
          outstandingQuantity?: number
          partId: string
          receiptId: string
          receivedQuantity?: number
          shelfId?: string | null
          unitOfMeasure: string
          unitPrice: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          id?: string
          lineId?: string | null
          locationId?: string | null
          orderQuantity?: number
          outstandingQuantity?: number
          partId?: string
          receiptId?: string
          receivedQuantity?: number
          shelfId?: string | null
          unitOfMeasure?: string
          unitPrice?: number
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receiptLine_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiptLine_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "receiptLine_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiptLine_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "receiptLine_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "receiptLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "part"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiptLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["partId"]
          },
          {
            foreignKeyName: "receiptLine_partId_fkey"
            columns: ["partId"]
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiptLine_receiptId_fkey"
            columns: ["receiptId"]
            referencedRelation: "receipt"
            referencedColumns: ["receiptId"]
          },
          {
            foreignKeyName: "receiptLine_receiptId_fkey"
            columns: ["receiptId"]
            referencedRelation: "receiptsPostedNotInvoiced"
            referencedColumns: ["receiptId"]
          },
          {
            foreignKeyName: "receiptLine_shelfId_fkey"
            columns: ["shelfId", "locationId"]
            referencedRelation: "shelf"
            referencedColumns: ["id", "locationId"]
          },
          {
            foreignKeyName: "receiptLine_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receiptLine_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      search: {
        Row: {
          description: string | null
          entity: Database["public"]["Enums"]["searchEntity"] | null
          fts: unknown | null
          id: number
          link: string
          name: string
          uuid: string | null
        }
        Insert: {
          description?: string | null
          entity?: Database["public"]["Enums"]["searchEntity"] | null
          fts?: unknown | null
          id?: number
          link: string
          name: string
          uuid?: string | null
        }
        Update: {
          description?: string | null
          entity?: Database["public"]["Enums"]["searchEntity"] | null
          fts?: unknown | null
          id?: number
          link?: string
          name?: string
          uuid?: string | null
        }
        Relationships: []
      }
      sequence: {
        Row: {
          id: string
          name: string
          next: number
          prefix: string | null
          size: number
          step: number
          suffix: string | null
          table: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          name: string
          next?: number
          prefix?: string | null
          size?: number
          step?: number
          suffix?: string | null
          table: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          name?: string
          next?: number
          prefix?: string | null
          size?: number
          step?: number
          suffix?: string | null
          table?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      shelf: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          id: string
          locationId: string
          updatedAt: string | null
          updatedBy: string | null
          warehouseId: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          id: string
          locationId: string
          updatedAt?: string | null
          updatedBy?: string | null
          warehouseId?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          id?: string
          locationId?: string
          updatedAt?: string | null
          updatedBy?: string | null
          warehouseId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shelf_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shelf_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "shelf_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shelf_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "shelf_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "shelf_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shelf_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "shelf_warehouseId_fkey"
            columns: ["warehouseId"]
            referencedRelation: "warehouse"
            referencedColumns: ["id"]
          }
        ]
      }
      shift: {
        Row: {
          active: boolean
          endTime: string
          friday: boolean
          id: string
          locationId: string
          monday: boolean
          name: string
          saturday: boolean
          startTime: string
          sunday: boolean
          thursday: boolean
          tuesday: boolean
          wednesday: boolean
        }
        Insert: {
          active?: boolean
          endTime: string
          friday?: boolean
          id?: string
          locationId: string
          monday?: boolean
          name: string
          saturday?: boolean
          startTime: string
          sunday?: boolean
          thursday?: boolean
          tuesday?: boolean
          wednesday?: boolean
        }
        Update: {
          active?: boolean
          endTime?: string
          friday?: boolean
          id?: string
          locationId?: string
          monday?: boolean
          name?: string
          saturday?: boolean
          startTime?: string
          sunday?: boolean
          thursday?: boolean
          tuesday?: boolean
          wednesday?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "shifts_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "shifts_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          }
        ]
      }
      shippingMethod: {
        Row: {
          active: boolean
          carrier: Database["public"]["Enums"]["shippingCarrier"]
          carrierAccountId: string | null
          createdAt: string
          createdBy: string
          id: string
          name: string
          trackingUrl: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          carrier?: Database["public"]["Enums"]["shippingCarrier"]
          carrierAccountId?: string | null
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          trackingUrl?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          carrier?: Database["public"]["Enums"]["shippingCarrier"]
          carrierAccountId?: string | null
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          trackingUrl?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shippingMethod_carrierAccountId_fkey"
            columns: ["carrierAccountId"]
            referencedRelation: "account"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "shippingMethod_carrierAccountId_fkey"
            columns: ["carrierAccountId"]
            referencedRelation: "accounts"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "shippingMethod_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shippingMethod_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "shippingMethod_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shippingMethod_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      shippingTerm: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shippingTerm_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shippingTerm_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "shippingTerm_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shippingTerm_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      supplier: {
        Row: {
          accountManagerId: string | null
          createdAt: string
          createdBy: string | null
          defaultCurrencyCode: string | null
          defaultPaymentTermId: string | null
          defaultShippingMethodId: string | null
          defaultShippingTermId: string | null
          id: string
          logo: string | null
          name: string
          supplierStatusId: string | null
          supplierTypeId: string | null
          taxId: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountManagerId?: string | null
          createdAt?: string
          createdBy?: string | null
          defaultCurrencyCode?: string | null
          defaultPaymentTermId?: string | null
          defaultShippingMethodId?: string | null
          defaultShippingTermId?: string | null
          id?: string
          logo?: string | null
          name: string
          supplierStatusId?: string | null
          supplierTypeId?: string | null
          taxId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountManagerId?: string | null
          createdAt?: string
          createdBy?: string | null
          defaultCurrencyCode?: string | null
          defaultPaymentTermId?: string | null
          defaultShippingMethodId?: string | null
          defaultShippingTermId?: string | null
          id?: string
          logo?: string | null
          name?: string
          supplierStatusId?: string | null
          supplierTypeId?: string | null
          taxId?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_accountManagerId_fkey"
            columns: ["accountManagerId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_accountManagerId_fkey"
            columns: ["accountManagerId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "supplier_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "supplier_defaultPaymentTermId_fkey"
            columns: ["defaultPaymentTermId"]
            referencedRelation: "paymentTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_defaultShippingMethodId_fkey"
            columns: ["defaultShippingMethodId"]
            referencedRelation: "shippingMethod"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_defaultShippingTermId_fkey"
            columns: ["defaultShippingTermId"]
            referencedRelation: "shippingTerm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_supplierStatusId_fkey"
            columns: ["supplierStatusId"]
            referencedRelation: "supplierStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_supplierTypeId_fkey"
            columns: ["supplierTypeId"]
            referencedRelation: "supplierType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      supplierAccount: {
        Row: {
          id: string
          supplierId: string
        }
        Insert: {
          id: string
          supplierId: string
        }
        Update: {
          id?: string
          supplierId?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplierAccount_id_fkey"
            columns: ["id"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierAccount_id_fkey"
            columns: ["id"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "supplierAccount_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierAccount_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierAccount_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierAccount_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierAccount_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      supplierContact: {
        Row: {
          contactId: string
          id: string
          supplierId: string
          supplierLocationId: string | null
          userId: string | null
        }
        Insert: {
          contactId: string
          id?: string
          supplierId: string
          supplierLocationId?: string | null
          userId?: string | null
        }
        Update: {
          contactId?: string
          id?: string
          supplierId?: string
          supplierLocationId?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplierContact_contactId_fkey"
            columns: ["contactId"]
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierContact_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierContact_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_supplierLocationId_fkey"
            columns: ["supplierLocationId"]
            referencedRelation: "supplierLocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierContact_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      supplierLedger: {
        Row: {
          amount: number
          createdAt: string
          documentId: string | null
          documentType:
            | Database["public"]["Enums"]["supplierLedgerDocumentType"]
            | null
          entryNumber: number
          externalDocumentId: string | null
          id: string
          postingDate: string
          supplierId: string
        }
        Insert: {
          amount: number
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["supplierLedgerDocumentType"]
            | null
          entryNumber?: number
          externalDocumentId?: string | null
          id?: string
          postingDate?: string
          supplierId: string
        }
        Update: {
          amount?: number
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["supplierLedgerDocumentType"]
            | null
          entryNumber?: number
          externalDocumentId?: string | null
          id?: string
          postingDate?: string
          supplierId?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplierLedger_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierLedger_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierLedger_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierLedger_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierLedger_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      supplierLocation: {
        Row: {
          addressId: string
          id: string
          supplierId: string
        }
        Insert: {
          addressId: string
          id?: string
          supplierId: string
        }
        Update: {
          addressId?: string
          id?: string
          supplierId?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplierLocation_addressId_fkey"
            columns: ["addressId"]
            referencedRelation: "address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierLocation_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierLocation_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierLocation_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "supplierLocation_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierLocation_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      supplierStatus: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          name: string
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      supplierType: {
        Row: {
          color: string | null
          createdAt: string
          createdBy: string
          id: string
          name: string
          protected: boolean
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          color?: string | null
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          protected?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          color?: string | null
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          protected?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplierType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "supplierType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplierType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      unitOfMeasure: {
        Row: {
          active: boolean
          code: string
          createdAt: string
          createdBy: string
          id: string
          name: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          code: string
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          code?: string
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unitOfMeasure_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unitOfMeasure_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "unitOfMeasure_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unitOfMeasure_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      user: {
        Row: {
          about: string
          active: boolean | null
          avatarUrl: string | null
          createdAt: string
          email: string
          emailVerified: string | null
          firstName: string
          fullName: string | null
          id: string
          lastName: string
          updatedAt: string | null
        }
        Insert: {
          about?: string
          active?: boolean | null
          avatarUrl?: string | null
          createdAt?: string
          email: string
          emailVerified?: string | null
          firstName: string
          fullName?: string | null
          id: string
          lastName: string
          updatedAt?: string | null
        }
        Update: {
          about?: string
          active?: boolean | null
          avatarUrl?: string | null
          createdAt?: string
          email?: string
          emailVerified?: string | null
          firstName?: string
          fullName?: string | null
          id?: string
          lastName?: string
          updatedAt?: string | null
        }
        Relationships: []
      }
      userAttribute: {
        Row: {
          active: boolean | null
          attributeDataTypeId: number
          canSelfManage: boolean | null
          createdAt: string
          createdBy: string
          id: string
          listOptions: string[] | null
          name: string
          sortOrder: number
          updatedAt: string | null
          updatedBy: string | null
          userAttributeCategoryId: string
        }
        Insert: {
          active?: boolean | null
          attributeDataTypeId: number
          canSelfManage?: boolean | null
          createdAt?: string
          createdBy: string
          id?: string
          listOptions?: string[] | null
          name: string
          sortOrder?: number
          updatedAt?: string | null
          updatedBy?: string | null
          userAttributeCategoryId: string
        }
        Update: {
          active?: boolean | null
          attributeDataTypeId?: number
          canSelfManage?: boolean | null
          createdAt?: string
          createdBy?: string
          id?: string
          listOptions?: string[] | null
          name?: string
          sortOrder?: number
          updatedAt?: string | null
          updatedBy?: string | null
          userAttributeCategoryId?: string
        }
        Relationships: [
          {
            foreignKeyName: "userAttribute_attributeDataTypeId_fkey"
            columns: ["attributeDataTypeId"]
            referencedRelation: "attributeDataType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttribute_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttribute_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttribute_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttribute_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttribute_userAttributeCategoryId_fkey"
            columns: ["userAttributeCategoryId"]
            referencedRelation: "userAttributeCategory"
            referencedColumns: ["id"]
          }
        ]
      }
      userAttributeCategory: {
        Row: {
          active: boolean | null
          createdAt: string
          createdBy: string
          id: string
          name: string
          protected: boolean | null
          public: boolean | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean | null
          createdAt?: string
          createdBy: string
          id?: string
          name: string
          protected?: boolean | null
          public?: boolean | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean | null
          createdAt?: string
          createdBy?: string
          id?: string
          name?: string
          protected?: boolean | null
          public?: boolean | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "userAttributeCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttributeCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      userAttributeValue: {
        Row: {
          createdAt: string
          createdBy: string
          id: string
          updatedAt: string | null
          updatedBy: string | null
          userAttributeId: string
          userId: string
          valueBoolean: boolean | null
          valueDate: string | null
          valueNumeric: number | null
          valueText: string | null
          valueUser: string | null
        }
        Insert: {
          createdAt?: string
          createdBy: string
          id?: string
          updatedAt?: string | null
          updatedBy?: string | null
          userAttributeId: string
          userId: string
          valueBoolean?: boolean | null
          valueDate?: string | null
          valueNumeric?: number | null
          valueText?: string | null
          valueUser?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string
          id?: string
          updatedAt?: string | null
          updatedBy?: string | null
          userAttributeId?: string
          userId?: string
          valueBoolean?: boolean | null
          valueDate?: string | null
          valueNumeric?: number | null
          valueText?: string | null
          valueUser?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "userAttributeValue_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeValue_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttributeValue_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeValue_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttributeValue_userAttributeId_fkey"
            columns: ["userAttributeId"]
            referencedRelation: "userAttribute"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeValue_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeValue_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "userAttributeValue_valueUser_fkey"
            columns: ["valueUser"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "userAttributeValue_valueUser_fkey"
            columns: ["valueUser"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      valueLedger: {
        Row: {
          actualCostPostedToGl: number
          adjustment: boolean
          costAmountActual: number
          costAmountExpected: number
          costLedgerType: Database["public"]["Enums"]["costLedgerType"]
          createdAt: string
          documentId: string | null
          documentType:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber: number
          expectedCostPostedToGl: number
          externalDocumentId: string | null
          id: string
          partLedgerType: Database["public"]["Enums"]["partLedgerType"]
          postingDate: string
        }
        Insert: {
          actualCostPostedToGl?: number
          adjustment?: boolean
          costAmountActual?: number
          costAmountExpected?: number
          costLedgerType: Database["public"]["Enums"]["costLedgerType"]
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber?: number
          expectedCostPostedToGl?: number
          externalDocumentId?: string | null
          id?: string
          partLedgerType: Database["public"]["Enums"]["partLedgerType"]
          postingDate?: string
        }
        Update: {
          actualCostPostedToGl?: number
          adjustment?: boolean
          costAmountActual?: number
          costAmountExpected?: number
          costLedgerType?: Database["public"]["Enums"]["costLedgerType"]
          createdAt?: string
          documentId?: string | null
          documentType?:
            | Database["public"]["Enums"]["partLedgerDocumentType"]
            | null
          entryNumber?: number
          expectedCostPostedToGl?: number
          externalDocumentId?: string | null
          id?: string
          partLedgerType?: Database["public"]["Enums"]["partLedgerType"]
          postingDate?: string
        }
        Relationships: []
      }
      valueLedgerJournalLineRelation: {
        Row: {
          journalLineId: string
          valueLedgerId: string
        }
        Insert: {
          journalLineId: string
          valueLedgerId: string
        }
        Update: {
          journalLineId?: string
          valueLedgerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "valueLedgerJournalLineRelation_journalLineId_fkey"
            columns: ["journalLineId"]
            referencedRelation: "journalLine"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valueLedgerJournalLineRelation_valueLedgerId_fkey"
            columns: ["valueLedgerId"]
            referencedRelation: "valueLedger"
            referencedColumns: ["id"]
          }
        ]
      }
      warehouse: {
        Row: {
          active: boolean
          createdAt: string
          createdBy: string
          id: string
          locationId: string
          name: string
          requiresBin: boolean
          requiresPick: boolean
          requiresPutAway: boolean
          requiresReceive: boolean
          requiresShipment: boolean
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          createdAt?: string
          createdBy: string
          id?: string
          locationId: string
          name: string
          requiresBin?: boolean
          requiresPick?: boolean
          requiresPutAway?: boolean
          requiresReceive?: boolean
          requiresShipment?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          createdAt?: string
          createdBy?: string
          id?: string
          locationId?: string
          name?: string
          requiresBin?: boolean
          requiresPick?: boolean
          requiresPutAway?: boolean
          requiresReceive?: boolean
          requiresShipment?: boolean
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "warehouse_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "warehouse_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "warehouse_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      workCell: {
        Row: {
          active: boolean
          activeDate: string | null
          createdAt: string
          createdBy: string
          defaultStandardFactor: Database["public"]["Enums"]["factor"]
          departmentId: string
          description: string | null
          id: string
          locationId: string | null
          name: string
          updatedAt: string | null
          updatedBy: string | null
          workCellTypeId: string
        }
        Insert: {
          active?: boolean
          activeDate?: string | null
          createdAt?: string
          createdBy: string
          defaultStandardFactor?: Database["public"]["Enums"]["factor"]
          departmentId: string
          description?: string | null
          id?: string
          locationId?: string | null
          name: string
          updatedAt?: string | null
          updatedBy?: string | null
          workCellTypeId: string
        }
        Update: {
          active?: boolean
          activeDate?: string | null
          createdAt?: string
          createdBy?: string
          defaultStandardFactor?: Database["public"]["Enums"]["factor"]
          departmentId?: string
          description?: string | null
          id?: string
          locationId?: string | null
          name?: string
          updatedAt?: string | null
          updatedBy?: string | null
          workCellTypeId?: string
        }
        Relationships: [
          {
            foreignKeyName: "workCell_departmentId_fkey"
            columns: ["departmentId"]
            referencedRelation: "department"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workCell_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workCell_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "workCell_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "workCell_workCellTypeId_fkey"
            columns: ["workCellTypeId"]
            referencedRelation: "workCellType"
            referencedColumns: ["id"]
          }
        ]
      }
      workCellType: {
        Row: {
          active: boolean
          color: string
          createdAt: string
          createdBy: string
          description: string | null
          id: string
          name: string
          requiredAbility: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          active?: boolean
          color?: string
          createdAt?: string
          createdBy: string
          description?: string | null
          id?: string
          name: string
          requiredAbility?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          active?: boolean
          color?: string
          createdAt?: string
          createdBy?: string
          description?: string | null
          id?: string
          name?: string
          requiredAbility?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workCellType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workCellType_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "workCellType_requiredAbility_fkey"
            columns: ["requiredAbility"]
            referencedRelation: "ability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workCellType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workCellType_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
    }
    Views: {
      accountCategories: {
        Row: {
          category: string | null
          createdAt: string | null
          createdBy: string | null
          id: string | null
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"] | null
          normalBalance: Database["public"]["Enums"]["glNormalBalance"] | null
          subCategoriesCount: number | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          category?: string | null
          createdAt?: string | null
          createdBy?: string | null
          id?: string | null
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"] | null
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"] | null
          subCategoriesCount?: never
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          category?: string | null
          createdAt?: string | null
          createdBy?: string | null
          id?: string | null
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"] | null
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"] | null
          subCategoriesCount?: never
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accountCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountCategory_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "accountCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accountCategory_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      accounts: {
        Row: {
          accountCategory: string | null
          accountCategoryId: string | null
          accountSubCategory: string | null
          accountSubcategoryId: string | null
          active: boolean | null
          consolidatedRate:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt: string | null
          createdBy: string | null
          directPosting: boolean | null
          id: string | null
          incomeBalance: Database["public"]["Enums"]["glIncomeBalance"] | null
          name: string | null
          normalBalance: Database["public"]["Enums"]["glNormalBalance"] | null
          number: string | null
          type: Database["public"]["Enums"]["glAccountType"] | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          accountCategory?: never
          accountCategoryId?: string | null
          accountSubCategory?: never
          accountSubcategoryId?: string | null
          active?: boolean | null
          consolidatedRate?:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt?: string | null
          createdBy?: string | null
          directPosting?: boolean | null
          id?: string | null
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"] | null
          name?: string | null
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"] | null
          number?: string | null
          type?: Database["public"]["Enums"]["glAccountType"] | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          accountCategory?: never
          accountCategoryId?: string | null
          accountSubCategory?: never
          accountSubcategoryId?: string | null
          active?: boolean | null
          consolidatedRate?:
            | Database["public"]["Enums"]["glConsolidatedRate"]
            | null
          createdAt?: string | null
          createdBy?: string | null
          directPosting?: boolean | null
          id?: string | null
          incomeBalance?: Database["public"]["Enums"]["glIncomeBalance"] | null
          name?: string | null
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"] | null
          number?: string | null
          type?: Database["public"]["Enums"]["glAccountType"] | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_accountCategoryId_fkey"
            columns: ["accountCategoryId"]
            referencedRelation: "accountCategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "account_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      contractors: {
        Row: {
          abilityIds: string[] | null
          active: boolean | null
          email: string | null
          firstName: string | null
          hoursPerWeek: number | null
          lastName: string | null
          supplierContactId: string | null
          supplierId: string | null
          supplierName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_id_fkey"
            columns: ["supplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          }
        ]
      }
      customers: {
        Row: {
          customerStatusId: string | null
          customerTypeId: string | null
          id: string | null
          name: string | null
          status: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_customerStatusId_fkey"
            columns: ["customerStatusId"]
            referencedRelation: "customerStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_customerTypeId_fkey"
            columns: ["customerTypeId"]
            referencedRelation: "customerType"
            referencedColumns: ["id"]
          }
        ]
      }
      documentLabels: {
        Row: {
          label: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documentLabels_userId_fkey"
            columns: ["userId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentLabels_userId_fkey"
            columns: ["userId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      documents: {
        Row: {
          active: boolean | null
          createdAt: string | null
          createdBy: string | null
          createdByAvatar: string | null
          createdByFullName: string | null
          description: string | null
          favorite: boolean | null
          id: string | null
          labels: string[] | null
          lastActivityAt: string | null
          name: string | null
          path: string | null
          readGroups: string[] | null
          size: number | null
          type: string | null
          updatedAt: string | null
          updatedBy: string | null
          updatedByAvatar: string | null
          updatedByFullName: string | null
          writeGroups: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "document_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "document_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      groupMembers: {
        Row: {
          groupId: string | null
          id: number | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
          isIdentityGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          memberGroupId: string | null
          memberUserId: string | null
          name: string | null
          user: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_groupId_fkey"
            columns: ["groupId"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberGroupId_fkey"
            columns: ["memberGroupId"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberUserId_fkey"
            columns: ["memberUserId"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_memberUserId_fkey"
            columns: ["memberUserId"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      groups: {
        Row: {
          id: string | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          name: string | null
          parentId: string | null
          users: Json | null
        }
        Relationships: []
      }
      groups_recursive: {
        Row: {
          groupId: string | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
          isIdentityGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          name: string | null
          parentId: string | null
          user: Json | null
        }
        Relationships: []
      }
      holidayYears: {
        Row: {
          year: number | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          abilityIds: string[] | null
          active: boolean | null
          city: string | null
          hoursPerWeek: number | null
          state: string | null
          supplierId: string | null
          supplierLocationId: string | null
          supplierName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_id_fkey"
            columns: ["supplierLocationId"]
            referencedRelation: "supplierLocation"
            referencedColumns: ["id"]
          }
        ]
      }
      partQuantities: {
        Row: {
          locationId: string | null
          partId: string | null
          quantityAvailable: number | null
          quantityOnHand: number | null
          quantityOnProdOrder: number | null
          quantityOnPurchaseOrder: number | null
          quantityOnSalesOrder: number | null
        }
        Relationships: []
      }
      parts: {
        Row: {
          active: boolean | null
          description: string | null
          id: string | null
          name: string | null
          partGroup: string | null
          partGroupId: string | null
          partType: Database["public"]["Enums"]["partType"] | null
          replenishmentSystem:
            | Database["public"]["Enums"]["partReplenishmentSystem"]
            | null
          supplierIds: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "part_partGroupId_fkey"
            columns: ["partGroupId"]
            referencedRelation: "partGroup"
            referencedColumns: ["id"]
          }
        ]
      }
      purchaseInvoices: {
        Row: {
          balance: number | null
          contactName: string | null
          createdAt: string | null
          createdBy: string | null
          createdByAvatar: string | null
          createdByFullName: string | null
          currencyCode: string | null
          dateDue: string | null
          dateIssued: string | null
          datePaid: string | null
          exchangeRate: number | null
          id: string | null
          invoiceId: string | null
          status: Database["public"]["Enums"]["purchaseInvoiceStatus"] | null
          subtotal: number | null
          supplierContactId: string | null
          supplierId: string | null
          supplierName: string | null
          supplierReference: string | null
          totalAmount: number | null
          totalDiscount: number | null
          totalTax: number | null
          updatedAt: string | null
          updatedBy: string | null
          updatedByAvatar: string | null
          updatedByFullName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseInvoice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseInvoice_currencyCode_fkey"
            columns: ["currencyCode"]
            referencedRelation: "currency"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierContactId_fkey"
            columns: ["supplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseInvoice_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrders: {
        Row: {
          closedAt: string | null
          closedBy: string | null
          closedByAvatar: string | null
          closedByFullName: string | null
          createdAt: string | null
          createdBy: string | null
          createdByAvatar: string | null
          createdByFullName: string | null
          dropShipment: boolean | null
          favorite: boolean | null
          id: string | null
          lineCount: number | null
          locationId: string | null
          locationName: string | null
          notes: string | null
          orderDate: string | null
          purchaseOrderId: string | null
          receiptPromisedDate: string | null
          receiptRequestedDate: string | null
          status: Database["public"]["Enums"]["purchaseOrderStatus"] | null
          subtotal: number | null
          supplierContactId: string | null
          supplierId: string | null
          supplierName: string | null
          supplierReference: string | null
          type: Database["public"]["Enums"]["purchaseOrderType"] | null
          updatedAt: string | null
          updatedBy: string | null
          updatedByAvatar: string | null
          updatedByFullName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchaseOrder_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_closedBy_fkey"
            columns: ["closedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrder_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_createdBy_fkey"
            columns: ["createdBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierContactId_fkey"
            columns: ["supplierContactId"]
            referencedRelation: "supplierContact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchaseOrder_updatedBy_fkey"
            columns: ["updatedBy"]
            referencedRelation: "userDefaults"
            referencedColumns: ["userId"]
          }
        ]
      }
      purchaseOrderSuppliers: {
        Row: {
          id: string | null
          name: string | null
        }
        Relationships: []
      }
      receiptQuantityReceivedByLine: {
        Row: {
          lineId: string | null
          receivedQuantity: number | null
          sourceDocumentId: string | null
        }
        Relationships: []
      }
      receiptsPostedNotInvoiced: {
        Row: {
          estimatedCost: number | null
          id: string | null
          postingDate: string | null
          receiptId: string | null
          sourceDocument:
            | Database["public"]["Enums"]["receiptSourceDocument"]
            | null
          sourceDocumentId: string | null
          sourceDocumentReadableId: string | null
          supplierId: string | null
          supplierName: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "supplier"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "contractors"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "partners"
            referencedColumns: ["supplierId"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "purchaseOrderSuppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipt_supplierId_fkey"
            columns: ["supplierId"]
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          }
        ]
      }
      suppliers: {
        Row: {
          id: string | null
          name: string | null
          orderCount: number | null
          partCount: number | null
          status: string | null
          supplierStatusId: string | null
          supplierTypeId: string | null
          type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_supplierStatusId_fkey"
            columns: ["supplierStatusId"]
            referencedRelation: "supplierStatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_supplierTypeId_fkey"
            columns: ["supplierTypeId"]
            referencedRelation: "supplierType"
            referencedColumns: ["id"]
          }
        ]
      }
      totalReceiptsPostedNotInvoiced: {
        Row: {
          total: number | null
        }
        Relationships: []
      }
      userDefaults: {
        Row: {
          locationId: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "partQuantities"
            referencedColumns: ["locationId"]
          },
          {
            foreignKeyName: "employeeJob_locationId_fkey"
            columns: ["locationId"]
            referencedRelation: "purchaseOrders"
            referencedColumns: ["locationId"]
          }
        ]
      }
    }
    Functions: {
      _xid_machine_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      groups_for_user: {
        Args: {
          uid: string
        }
        Returns: unknown
      }
      groups_query: {
        Args: {
          _name?: string
          _uid?: string
        }
        Returns: {
          id: string
          name: string
          parentId: string
          isEmployeeTypeGroup: boolean
          isCustomerOrgGroup: boolean
          isCustomerTypeGroup: boolean
          isSupplierOrgGroup: boolean
          isSupplierTypeGroup: boolean
          users: Json
        }[]
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      journalLinesByAccountNumber: {
        Args: {
          from_date?: string
          to_date?: string
        }
        Returns: {
          number: string
          balance: number
          balanceAtDate: number
          netChange: number
        }[]
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      users_for_groups: {
        Args: {
          groups: string[]
        }
        Returns: Json
      }
      xid: {
        Args: {
          _at?: string
        }
        Returns: unknown
      }
      xid_counter: {
        Args: {
          _xid: unknown
        }
        Returns: number
      }
      xid_decode: {
        Args: {
          _xid: unknown
        }
        Returns: unknown
      }
      xid_encode: {
        Args: {
          _id: number[]
        }
        Returns: unknown
      }
      xid_machine: {
        Args: {
          _xid: unknown
        }
        Returns: unknown
      }
      xid_pid: {
        Args: {
          _xid: unknown
        }
        Returns: number
      }
      xid_time: {
        Args: {
          _xid: unknown
        }
        Returns: string
      }
    }
    Enums: {
      accountingPeriodStatus: "Inactive" | "Active"
      costLedgerType:
        | "Direct Cost"
        | "Revaluation"
        | "Rounding"
        | "Indirect Cost"
        | "Variance"
        | "Total"
      documentTransactionType:
        | "Download"
        | "Edit"
        | "Favorite"
        | "Label"
        | "Unfavorite"
        | "Upload"
      factor:
        | "Hours/Piece"
        | "Hours/100 Pieces"
        | "Hours/1000 Pieces"
        | "Minutes/Piece"
        | "Minutes/100 Pieces"
        | "Minutes/1000 Pieces"
        | "Pieces/Hour"
        | "Pieces/Minute"
        | "Seconds/Piece"
        | "Total Hours"
        | "Total Minutes"
      glAccountCategory:
        | "Bank"
        | "Accounts Receivable"
        | "Inventory"
        | "Other Current Asset"
        | "Fixed Asset"
        | "Accumulated Depreciation"
        | "Other Asset"
        | "Accounts Payable"
        | "Other Current Liability"
        | "Long Term Liability"
        | "Equity - No Close"
        | "Equity - Close"
        | "Retained Earnings"
        | "Income"
        | "Cost of Goods Sold"
        | "Expense"
        | "Other Income"
        | "Other Expense"
      glAccountType: "Posting" | "Heading" | "Begin Total" | "End Total"
      glConsolidatedRate: "Average" | "Current" | "Historical"
      glIncomeBalance: "Balance Sheet" | "Income Statement"
      glNormalBalance: "Debit" | "Credit" | "Both"
      journalLineDocumentType:
        | "Quote"
        | "Order"
        | "Invoice"
        | "Credit Memo"
        | "Blanket Order"
        | "Return Order"
      month:
        | "January"
        | "February"
        | "March"
        | "April"
        | "May"
        | "June"
        | "July"
        | "August"
        | "September"
        | "October"
        | "November"
        | "December"
      partCostingMethod: "Standard" | "Average" | "LIFO" | "FIFO"
      partLedgerDocumentType:
        | "Sales Shipment"
        | "Sales Invoice"
        | "Sales Return Receipt"
        | "Sales Credit Memo"
        | "Purchase Receipt"
        | "Purchase Invoice"
        | "Purchase Return Shipment"
        | "Purchase Credit Memo"
        | "Transfer Shipment"
        | "Transfer Receipt"
        | "Service Shipment"
        | "Service Invoice"
        | "Service Credit Memo"
        | "Posted Assembly"
        | "Inventory Receipt"
        | "Inventory Shipment"
        | "Direct Transfer"
      partLedgerType:
        | "Purchase"
        | "Sale"
        | "Positive Adjmt."
        | "Negative Adjmt."
        | "Transfer"
        | "Consumption"
        | "Output"
        | "Assembly Consumption"
        | "Assembly Output"
      partManufacturingPolicy: "Make to Order" | "Make to Stock"
      partReorderingPolicy:
        | "Manual Reorder"
        | "Demand-Based Reorder"
        | "Fixed Reorder Quantity"
        | "Maximum Quantity"
      partReplenishmentSystem: "Buy" | "Make" | "Buy and Make"
      partType: "Inventory" | "Non-Inventory" | "Service"
      payableLineType: "G/L Account" | "Part" | "Fixed Asset"
      paymentTermCalculationMethod: "Net" | "End of Month" | "Day of Month"
      purchaseInvoiceStatus:
        | "Draft"
        | "Submitted"
        | "Return"
        | "Debit Note Issued"
        | "Paid"
        | "Partially Paid"
        | "Overdue"
        | "Voided"
      purchaseOrderLineType: "Comment" | "G/L Account" | "Part" | "Fixed Asset"
      purchaseOrderStatus:
        | "Draft"
        | "To Review"
        | "Rejected"
        | "To Receive"
        | "To Receive and Invoice"
        | "To Invoice"
        | "Completed"
        | "Closed"
      purchaseOrderTransactionType:
        | "Edit"
        | "Favorite"
        | "Unfavorite"
        | "Approved"
        | "Reject"
        | "Request Approval"
      purchaseOrderType: "Purchase" | "Return"
      receiptSourceDocument:
        | "Sales Order"
        | "Sales Return Order"
        | "Purchase Order"
        | "Purchase Return Order"
        | "Inbound Transfer"
        | "Outbound Transfer"
        | "Manufacturing Consumption"
        | "Manufacturing Output"
      receiptStatus: "Draft" | "Pending" | "Posted"
      searchEntity:
        | "Resource"
        | "Person"
        | "Customer"
        | "Supplier"
        | "Job"
        | "Part"
        | "Purchase Order"
        | "Sales Order"
        | "Document"
      shippingCarrier: "UPS" | "FedEx" | "USPS" | "DHL" | "Other"
      supplierLedgerDocumentType:
        | "Payment"
        | "Invoice"
        | "Credit Memo"
        | "Finance Charge Memo"
        | "Reminder"
        | "Refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

