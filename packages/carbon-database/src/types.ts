export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      ability: {
        Row: {
          name: string;
          createdBy: string;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          curve: Json;
          shadowWeeks: number;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          createdBy: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          curve?: Json;
          shadowWeeks?: number;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          createdBy?: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          curve?: Json;
          shadowWeeks?: number;
          active?: boolean;
          createdAt?: string;
        };
      };
      account: {
        Row: {
          number: string;
          name: string;
          description: string | null;
          accountCategoryId: string | null;
          consolidatedRate:
            | Database["public"]["Enums"]["consolidatedRate"]
            | null;
          currencyCode: string | null;
          parentAccountNumber: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          controlAccount: boolean;
          cashAccount: boolean;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          number: string;
          name: string;
          description?: string | null;
          accountCategoryId?: string | null;
          consolidatedRate?:
            | Database["public"]["Enums"]["consolidatedRate"]
            | null;
          currencyCode?: string | null;
          parentAccountNumber?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          controlAccount?: boolean;
          cashAccount?: boolean;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          number?: string;
          name?: string;
          description?: string | null;
          accountCategoryId?: string | null;
          consolidatedRate?:
            | Database["public"]["Enums"]["consolidatedRate"]
            | null;
          currencyCode?: string | null;
          parentAccountNumber?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          controlAccount?: boolean;
          cashAccount?: boolean;
          active?: boolean;
          createdAt?: string;
        };
      };
      accountCategory: {
        Row: {
          category: Database["public"]["Enums"]["glAccountCategory"];
          type: Database["public"]["Enums"]["glAccountType"];
          normalBalance: Database["public"]["Enums"]["glNormalBalance"];
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["glAccountCategory"];
          type: Database["public"]["Enums"]["glAccountType"];
          normalBalance: Database["public"]["Enums"]["glNormalBalance"];
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["glAccountCategory"];
          type?: Database["public"]["Enums"]["glAccountType"];
          normalBalance?: Database["public"]["Enums"]["glNormalBalance"];
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      address: {
        Row: {
          addressLine1: string | null;
          addressLine2: string | null;
          city: string | null;
          state: string | null;
          postalCode: string | null;
          countryId: number | null;
          phone: string | null;
          fax: string | null;
          id: string;
        };
        Insert: {
          addressLine1?: string | null;
          addressLine2?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          countryId?: number | null;
          phone?: string | null;
          fax?: string | null;
          id?: string;
        };
        Update: {
          addressLine1?: string | null;
          addressLine2?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          countryId?: number | null;
          phone?: string | null;
          fax?: string | null;
          id?: string;
        };
      };
      attributeDataType: {
        Row: {
          label: string;
          id: number;
          isBoolean: boolean;
          isDate: boolean;
          isList: boolean;
          isNumeric: boolean;
          isText: boolean;
          isUser: boolean;
        };
        Insert: {
          label: string;
          id?: number;
          isBoolean?: boolean;
          isDate?: boolean;
          isList?: boolean;
          isNumeric?: boolean;
          isText?: boolean;
          isUser?: boolean;
        };
        Update: {
          label?: string;
          id?: number;
          isBoolean?: boolean;
          isDate?: boolean;
          isList?: boolean;
          isNumeric?: boolean;
          isText?: boolean;
          isUser?: boolean;
        };
      };
      contact: {
        Row: {
          firstName: string;
          lastName: string;
          email: string;
          title: string | null;
          mobilePhone: string | null;
          homePhone: string | null;
          workPhone: string | null;
          fax: string | null;
          addressLine1: string | null;
          addressLine2: string | null;
          city: string | null;
          state: string | null;
          postalCode: string | null;
          countryId: number | null;
          birthday: string | null;
          notes: string | null;
          id: string;
        };
        Insert: {
          firstName: string;
          lastName: string;
          email: string;
          title?: string | null;
          mobilePhone?: string | null;
          homePhone?: string | null;
          workPhone?: string | null;
          fax?: string | null;
          addressLine1?: string | null;
          addressLine2?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          countryId?: number | null;
          birthday?: string | null;
          notes?: string | null;
          id?: string;
        };
        Update: {
          firstName?: string;
          lastName?: string;
          email?: string;
          title?: string | null;
          mobilePhone?: string | null;
          homePhone?: string | null;
          workPhone?: string | null;
          fax?: string | null;
          addressLine1?: string | null;
          addressLine2?: string | null;
          city?: string | null;
          state?: string | null;
          postalCode?: string | null;
          countryId?: number | null;
          birthday?: string | null;
          notes?: string | null;
          id?: string;
        };
      };
      contractor: {
        Row: {
          id: string;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          hoursPerWeek: number;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          id: string;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          hoursPerWeek?: number;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          hoursPerWeek?: number;
          active?: boolean;
          createdAt?: string;
        };
      };
      contractorAbility: {
        Row: {
          contractorId: string;
          abilityId: string;
          createdBy: string;
          createdAt: string;
        };
        Insert: {
          contractorId: string;
          abilityId: string;
          createdBy: string;
          createdAt?: string;
        };
        Update: {
          contractorId?: string;
          abilityId?: string;
          createdBy?: string;
          createdAt?: string;
        };
      };
      country: {
        Row: {
          name: string;
          code: string;
          id: number;
        };
        Insert: {
          name: string;
          code: string;
          id?: number;
        };
        Update: {
          name?: string;
          code?: string;
          id?: number;
        };
      };
      crew: {
        Row: {
          name: string;
          description: string | null;
          crewLeaderId: string | null;
          groupId: string;
          workCellId: string | null;
          id: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          crewLeaderId?: string | null;
          groupId: string;
          workCellId?: string | null;
          id?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          crewLeaderId?: string | null;
          groupId?: string;
          workCellId?: string | null;
          id?: string;
        };
      };
      crewAbility: {
        Row: {
          crewId: string;
          abilityId: string;
          id: string;
          active: boolean;
        };
        Insert: {
          crewId: string;
          abilityId: string;
          id?: string;
          active?: boolean;
        };
        Update: {
          crewId?: string;
          abilityId?: string;
          id?: string;
          active?: boolean;
        };
      };
      currency: {
        Row: {
          name: string;
          code: string;
          symbol: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          symbolPlacementBefore: boolean;
          exchangeRate: number;
          currencyPrecision: number;
          isBaseCurrency: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          code: string;
          symbol?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          symbolPlacementBefore?: boolean;
          exchangeRate?: number;
          currencyPrecision?: number;
          isBaseCurrency?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          code?: string;
          symbol?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          symbolPlacementBefore?: boolean;
          exchangeRate?: number;
          currencyPrecision?: number;
          isBaseCurrency?: boolean;
          createdAt?: string;
        };
      };
      customer: {
        Row: {
          name: string;
          description: string | null;
          customerTypeId: string | null;
          customerStatusId: string | null;
          taxId: string | null;
          accountManagerId: string | null;
          logo: string | null;
          createdBy: string | null;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          customerTypeId?: string | null;
          customerStatusId?: string | null;
          taxId?: string | null;
          accountManagerId?: string | null;
          logo?: string | null;
          createdBy?: string | null;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          customerTypeId?: string | null;
          customerStatusId?: string | null;
          taxId?: string | null;
          accountManagerId?: string | null;
          logo?: string | null;
          createdBy?: string | null;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      customerAccount: {
        Row: {
          id: string;
          customerId: string;
        };
        Insert: {
          id: string;
          customerId: string;
        };
        Update: {
          id?: string;
          customerId?: string;
        };
      };
      customerContact: {
        Row: {
          customerId: string;
          contactId: string;
          customerLocationId: string | null;
          userId: string | null;
          id: string;
        };
        Insert: {
          customerId: string;
          contactId: string;
          customerLocationId?: string | null;
          userId?: string | null;
          id?: string;
        };
        Update: {
          customerId?: string;
          contactId?: string;
          customerLocationId?: string | null;
          userId?: string | null;
          id?: string;
        };
      };
      customerLocation: {
        Row: {
          customerId: string;
          addressId: string;
          id: string;
        };
        Insert: {
          customerId: string;
          addressId: string;
          id?: string;
        };
        Update: {
          customerId?: string;
          addressId?: string;
          id?: string;
        };
      };
      customerStatus: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      customerType: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          color: string | null;
          protected: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          color?: string | null;
          protected?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          color?: string | null;
          protected?: boolean;
          createdAt?: string;
        };
      };
      department: {
        Row: {
          name: string;
          parentDepartmentId: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          color: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          parentDepartmentId?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          parentDepartmentId?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          createdAt?: string;
        };
      };
      document: {
        Row: {
          name: string;
          description: string | null;
          size: number;
          readGroups: string[] | null;
          writeGroups: string[] | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          type: string | null;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          size: number;
          readGroups?: string[] | null;
          writeGroups?: string[] | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          type?: string | null;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          size?: number;
          readGroups?: string[] | null;
          writeGroups?: string[] | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          type?: string | null;
          active?: boolean;
          createdAt?: string;
        };
      };
      documentTransactions: {
        Row: {
          documentId: string;
          type: Database["public"]["Enums"]["documentTransactionType"];
          userId: string;
          id: string;
          createdAt: string;
        };
        Insert: {
          documentId: string;
          type: Database["public"]["Enums"]["documentTransactionType"];
          userId: string;
          id?: string;
          createdAt?: string;
        };
        Update: {
          documentId?: string;
          type?: Database["public"]["Enums"]["documentTransactionType"];
          userId?: string;
          id?: string;
          createdAt?: string;
        };
      };
      employee: {
        Row: {
          id: string;
          employeeTypeId: string;
        };
        Insert: {
          id: string;
          employeeTypeId: string;
        };
        Update: {
          id?: string;
          employeeTypeId?: string;
        };
      };
      employeeAbility: {
        Row: {
          employeeId: string;
          abilityId: string;
          lastTrainingDate: string | null;
          id: string;
          active: boolean;
          trainingDays: number;
          trainingCompleted: boolean | null;
        };
        Insert: {
          employeeId: string;
          abilityId: string;
          lastTrainingDate?: string | null;
          id?: string;
          active?: boolean;
          trainingDays?: number;
          trainingCompleted?: boolean | null;
        };
        Update: {
          employeeId?: string;
          abilityId?: string;
          lastTrainingDate?: string | null;
          id?: string;
          active?: boolean;
          trainingDays?: number;
          trainingCompleted?: boolean | null;
        };
      };
      employeeJob: {
        Row: {
          id: string;
          locationId: string | null;
          shiftId: string | null;
          managerId: string | null;
          title: string | null;
          startDate: string | null;
          departmentId: string | null;
          workCellId: string | null;
        };
        Insert: {
          id: string;
          locationId?: string | null;
          shiftId?: string | null;
          managerId?: string | null;
          title?: string | null;
          startDate?: string | null;
          departmentId?: string | null;
          workCellId?: string | null;
        };
        Update: {
          id?: string;
          locationId?: string | null;
          shiftId?: string | null;
          managerId?: string | null;
          title?: string | null;
          startDate?: string | null;
          departmentId?: string | null;
          workCellId?: string | null;
        };
      };
      employeeShift: {
        Row: {
          employeeId: string;
          shiftId: string;
          id: string;
        };
        Insert: {
          employeeId: string;
          shiftId: string;
          id?: string;
        };
        Update: {
          employeeId?: string;
          shiftId?: string;
          id?: string;
        };
      };
      employeeType: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          color: string;
          protected: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          protected?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          protected?: boolean;
          createdAt?: string;
        };
      };
      employeeTypePermission: {
        Row: {
          employeeTypeId: string;
          featureId: string;
          updatedAt: string | null;
          create: boolean;
          delete: boolean;
          update: boolean;
          view: boolean;
          createdAt: string;
        };
        Insert: {
          employeeTypeId: string;
          featureId: string;
          updatedAt?: string | null;
          create?: boolean;
          delete?: boolean;
          update?: boolean;
          view?: boolean;
          createdAt?: string;
        };
        Update: {
          employeeTypeId?: string;
          featureId?: string;
          updatedAt?: string | null;
          create?: boolean;
          delete?: boolean;
          update?: boolean;
          view?: boolean;
          createdAt?: string;
        };
      };
      equipment: {
        Row: {
          name: string;
          description: string | null;
          equipmentTypeId: string;
          locationId: string;
          workCellId: string | null;
          activeDate: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          operatorsRequired: number;
          setupHours: number;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          equipmentTypeId: string;
          locationId: string;
          workCellId?: string | null;
          activeDate?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          operatorsRequired?: number;
          setupHours?: number;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          equipmentTypeId?: string;
          locationId?: string;
          workCellId?: string | null;
          activeDate?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          operatorsRequired?: number;
          setupHours?: number;
          active?: boolean;
          createdAt?: string;
        };
      };
      equipmentType: {
        Row: {
          name: string;
          description: string | null;
          requiredAbility: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          color: string;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          requiredAbility?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          requiredAbility?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          active?: boolean;
          createdAt?: string;
        };
      };
      feature: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      group: {
        Row: {
          name: string;
          id: string;
          updatedAt: string | null;
          isIdentityGroup: boolean;
          isEmployeeTypeGroup: boolean;
          isCustomerOrgGroup: boolean;
          isCustomerTypeGroup: boolean;
          isSupplierTypeGroup: boolean;
          isSupplierOrgGroup: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          id?: string;
          updatedAt?: string | null;
          isIdentityGroup?: boolean;
          isEmployeeTypeGroup?: boolean;
          isCustomerOrgGroup?: boolean;
          isCustomerTypeGroup?: boolean;
          isSupplierTypeGroup?: boolean;
          isSupplierOrgGroup?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          id?: string;
          updatedAt?: string | null;
          isIdentityGroup?: boolean;
          isEmployeeTypeGroup?: boolean;
          isCustomerOrgGroup?: boolean;
          isCustomerTypeGroup?: boolean;
          isSupplierTypeGroup?: boolean;
          isSupplierOrgGroup?: boolean;
          createdAt?: string;
        };
      };
      holiday: {
        Row: {
          name: string;
          date: string;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          year: number | null;
          createdAt: string;
        };
        Insert: {
          name: string;
          date: string;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          year?: number | null;
          createdAt?: string;
        };
        Update: {
          name?: string;
          date?: string;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          year?: number | null;
          createdAt?: string;
        };
      };
      location: {
        Row: {
          name: string;
          timezone: string;
          latitude: number | null;
          longitude: number | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          timezone: string;
          latitude?: number | null;
          longitude?: number | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          timezone?: string;
          latitude?: number | null;
          longitude?: number | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      membership: {
        Row: {
          groupId: string;
          memberGroupId: string | null;
          memberUserId: string | null;
          id: number;
        };
        Insert: {
          groupId: string;
          memberGroupId?: string | null;
          memberUserId?: string | null;
          id?: number;
        };
        Update: {
          groupId?: string;
          memberGroupId?: string | null;
          memberUserId?: string | null;
          id?: number;
        };
      };
      part: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          replenishmentSystem: Database["public"]["Enums"]["partReplenishmentSystem"];
          partGroupId: string;
          partType: Database["public"]["Enums"]["partType"];
          manufacturerPartNumber: string | null;
          unitOfMeasureCode: string;
          approvedBy: string | null;
          fromDate: string | null;
          toDate: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          blocked: boolean;
          active: boolean;
          approved: boolean;
          createdAt: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          replenishmentSystem: Database["public"]["Enums"]["partReplenishmentSystem"];
          partGroupId: string;
          partType: Database["public"]["Enums"]["partType"];
          manufacturerPartNumber?: string | null;
          unitOfMeasureCode: string;
          approvedBy?: string | null;
          fromDate?: string | null;
          toDate?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          blocked?: boolean;
          active?: boolean;
          approved?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          replenishmentSystem?: Database["public"]["Enums"]["partReplenishmentSystem"];
          partGroupId?: string;
          partType?: Database["public"]["Enums"]["partType"];
          manufacturerPartNumber?: string | null;
          unitOfMeasureCode?: string;
          approvedBy?: string | null;
          fromDate?: string | null;
          toDate?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          blocked?: boolean;
          active?: boolean;
          approved?: boolean;
          createdAt?: string;
        };
      };
      partCost: {
        Row: {
          partId: string;
          costingMethod: Database["public"]["Enums"]["partCostingMethod"];
          salesAccountId: string | null;
          discountAccountId: string | null;
          inventoryAccountId: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          standardCost: number;
          unitCost: number;
          costIsAdjusted: boolean;
          createdAt: string;
        };
        Insert: {
          partId: string;
          costingMethod: Database["public"]["Enums"]["partCostingMethod"];
          salesAccountId?: string | null;
          discountAccountId?: string | null;
          inventoryAccountId?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          standardCost?: number;
          unitCost?: number;
          costIsAdjusted?: boolean;
          createdAt?: string;
        };
        Update: {
          partId?: string;
          costingMethod?: Database["public"]["Enums"]["partCostingMethod"];
          salesAccountId?: string | null;
          discountAccountId?: string | null;
          inventoryAccountId?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          standardCost?: number;
          unitCost?: number;
          costIsAdjusted?: boolean;
          createdAt?: string;
        };
      };
      partGroup: {
        Row: {
          name: string;
          description: string | null;
          salesAccountId: string | null;
          discountAccountId: string | null;
          inventoryAccountId: string | null;
          costOfGoodsSoldLaborAccountId: string | null;
          costOfGoodsSoldMaterialAccountId: string | null;
          costOfGoodsSoldOverheadAccountId: string | null;
          costOfGoodsSoldSubcontractorAccountId: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          salesAccountId?: string | null;
          discountAccountId?: string | null;
          inventoryAccountId?: string | null;
          costOfGoodsSoldLaborAccountId?: string | null;
          costOfGoodsSoldMaterialAccountId?: string | null;
          costOfGoodsSoldOverheadAccountId?: string | null;
          costOfGoodsSoldSubcontractorAccountId?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          salesAccountId?: string | null;
          discountAccountId?: string | null;
          inventoryAccountId?: string | null;
          costOfGoodsSoldLaborAccountId?: string | null;
          costOfGoodsSoldMaterialAccountId?: string | null;
          costOfGoodsSoldOverheadAccountId?: string | null;
          costOfGoodsSoldSubcontractorAccountId?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          active?: boolean;
          createdAt?: string;
        };
      };
      partInventory: {
        Row: {
          partId: string;
          shelfId: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          stockoutWarning: boolean;
          unitVolume: number;
          unitWeight: number;
          createdAt: string;
        };
        Insert: {
          partId: string;
          shelfId?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          stockoutWarning?: boolean;
          unitVolume?: number;
          unitWeight?: number;
          createdAt?: string;
        };
        Update: {
          partId?: string;
          shelfId?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          stockoutWarning?: boolean;
          unitVolume?: number;
          unitWeight?: number;
          createdAt?: string;
        };
      };
      partner: {
        Row: {
          id: string;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          hoursPerWeek: number;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          id: string;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          hoursPerWeek?: number;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          hoursPerWeek?: number;
          active?: boolean;
          createdAt?: string;
        };
      };
      partnerAbility: {
        Row: {
          partnerId: string;
          abilityId: string;
          createdBy: string;
          createdAt: string;
        };
        Insert: {
          partnerId: string;
          abilityId: string;
          createdBy: string;
          createdAt?: string;
        };
        Update: {
          partnerId?: string;
          abilityId?: string;
          createdBy?: string;
          createdAt?: string;
        };
      };
      partPlanning: {
        Row: {
          partId: string;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          reorderingPolicy: Database["public"]["Enums"]["partReorderingPolicy"];
          critical: boolean;
          safetyStockQuantity: number;
          safetyStockLeadTime: number;
          demandAccumulationPeriod: number;
          demandReschedulingPeriod: number;
          demandAccumulationIncludesInventory: boolean;
          reorderPoint: number;
          reorderQuantity: number;
          reorderMaximumInventory: number;
          reorderOverflowLevel: number;
          reorderTimeBucket: number;
          minimumOrderQuantity: number;
          maximumOrderQuantity: number;
          orderMultiple: number;
          createdAt: string;
        };
        Insert: {
          partId: string;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          reorderingPolicy?: Database["public"]["Enums"]["partReorderingPolicy"];
          critical?: boolean;
          safetyStockQuantity?: number;
          safetyStockLeadTime?: number;
          demandAccumulationPeriod?: number;
          demandReschedulingPeriod?: number;
          demandAccumulationIncludesInventory?: boolean;
          reorderPoint?: number;
          reorderQuantity?: number;
          reorderMaximumInventory?: number;
          reorderOverflowLevel?: number;
          reorderTimeBucket?: number;
          minimumOrderQuantity?: number;
          maximumOrderQuantity?: number;
          orderMultiple?: number;
          createdAt?: string;
        };
        Update: {
          partId?: string;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          reorderingPolicy?: Database["public"]["Enums"]["partReorderingPolicy"];
          critical?: boolean;
          safetyStockQuantity?: number;
          safetyStockLeadTime?: number;
          demandAccumulationPeriod?: number;
          demandReschedulingPeriod?: number;
          demandAccumulationIncludesInventory?: boolean;
          reorderPoint?: number;
          reorderQuantity?: number;
          reorderMaximumInventory?: number;
          reorderOverflowLevel?: number;
          reorderTimeBucket?: number;
          minimumOrderQuantity?: number;
          maximumOrderQuantity?: number;
          orderMultiple?: number;
          createdAt?: string;
        };
      };
      partReplenishment: {
        Row: {
          partId: string;
          supplierId: string | null;
          supplierPartNumber: string | null;
          purchasingUnitOfMeasureCode: string | null;
          lotSize: number | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          purchasingLeadTime: number;
          purchasingBlocked: boolean;
          manufacturingPolicy: Database["public"]["Enums"]["partManufacturingPolicy"];
          manufacturingLeadTime: number;
          manufacturingBlocked: boolean;
          requiresConfiguration: boolean;
          scrapPercentage: number;
          createdAt: string;
        };
        Insert: {
          partId: string;
          supplierId?: string | null;
          supplierPartNumber?: string | null;
          purchasingUnitOfMeasureCode?: string | null;
          lotSize?: number | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          purchasingLeadTime?: number;
          purchasingBlocked?: boolean;
          manufacturingPolicy?: Database["public"]["Enums"]["partManufacturingPolicy"];
          manufacturingLeadTime?: number;
          manufacturingBlocked?: boolean;
          requiresConfiguration?: boolean;
          scrapPercentage?: number;
          createdAt?: string;
        };
        Update: {
          partId?: string;
          supplierId?: string | null;
          supplierPartNumber?: string | null;
          purchasingUnitOfMeasureCode?: string | null;
          lotSize?: number | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          purchasingLeadTime?: number;
          purchasingBlocked?: boolean;
          manufacturingPolicy?: Database["public"]["Enums"]["partManufacturingPolicy"];
          manufacturingLeadTime?: number;
          manufacturingBlocked?: boolean;
          requiresConfiguration?: boolean;
          scrapPercentage?: number;
          createdAt?: string;
        };
      };
      partUnitSalePrice: {
        Row: {
          partId: string;
          currencyCode: string;
          salesUnitOfMeasureCode: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          unitSalePrice: number;
          salesBlocked: boolean;
          priceIncludesTax: boolean;
          allowInvoiceDiscount: boolean;
          createdAt: string;
        };
        Insert: {
          partId: string;
          currencyCode: string;
          salesUnitOfMeasureCode?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          unitSalePrice?: number;
          salesBlocked?: boolean;
          priceIncludesTax?: boolean;
          allowInvoiceDiscount?: boolean;
          createdAt?: string;
        };
        Update: {
          partId?: string;
          currencyCode?: string;
          salesUnitOfMeasureCode?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          unitSalePrice?: number;
          salesBlocked?: boolean;
          priceIncludesTax?: boolean;
          allowInvoiceDiscount?: boolean;
          createdAt?: string;
        };
      };
      search: {
        Row: {
          id: number;
          name: string;
          entity: Database["public"]["Enums"]["searchEntity"] | null;
          uuid: string | null;
          link: string;
          description: string | null;
          fts: unknown | null;
        };
        Insert: {
          id?: number;
          name: string;
          entity?: Database["public"]["Enums"]["searchEntity"] | null;
          uuid?: string | null;
          link: string;
          description?: string | null;
          fts?: unknown | null;
        };
        Update: {
          id?: number;
          name?: string;
          entity?: Database["public"]["Enums"]["searchEntity"] | null;
          uuid?: string | null;
          link?: string;
          description?: string | null;
          fts?: unknown | null;
        };
      };
      shelf: {
        Row: {
          id: string;
          locationId: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          id: string;
          locationId?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          locationId?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          active?: boolean;
          createdAt?: string;
        };
      };
      shift: {
        Row: {
          name: string;
          startTime: string;
          endTime: string;
          locationId: string;
          id: string;
          sunday: boolean;
          monday: boolean;
          tuesday: boolean;
          wednesday: boolean;
          thursday: boolean;
          friday: boolean;
          saturday: boolean;
          active: boolean;
        };
        Insert: {
          name: string;
          startTime: string;
          endTime: string;
          locationId: string;
          id?: string;
          sunday?: boolean;
          monday?: boolean;
          tuesday?: boolean;
          wednesday?: boolean;
          thursday?: boolean;
          friday?: boolean;
          saturday?: boolean;
          active?: boolean;
        };
        Update: {
          name?: string;
          startTime?: string;
          endTime?: string;
          locationId?: string;
          id?: string;
          sunday?: boolean;
          monday?: boolean;
          tuesday?: boolean;
          wednesday?: boolean;
          thursday?: boolean;
          friday?: boolean;
          saturday?: boolean;
          active?: boolean;
        };
      };
      supplier: {
        Row: {
          name: string;
          description: string | null;
          supplierTypeId: string | null;
          supplierStatusId: string | null;
          taxId: string | null;
          accountManagerId: string | null;
          logo: string | null;
          createdBy: string | null;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          supplierTypeId?: string | null;
          supplierStatusId?: string | null;
          taxId?: string | null;
          accountManagerId?: string | null;
          logo?: string | null;
          createdBy?: string | null;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          supplierTypeId?: string | null;
          supplierStatusId?: string | null;
          taxId?: string | null;
          accountManagerId?: string | null;
          logo?: string | null;
          createdBy?: string | null;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      supplierAccount: {
        Row: {
          id: string;
          supplierId: string;
        };
        Insert: {
          id: string;
          supplierId: string;
        };
        Update: {
          id?: string;
          supplierId?: string;
        };
      };
      supplierContact: {
        Row: {
          supplierId: string;
          contactId: string;
          supplierLocationId: string | null;
          userId: string | null;
          id: string;
        };
        Insert: {
          supplierId: string;
          contactId: string;
          supplierLocationId?: string | null;
          userId?: string | null;
          id?: string;
        };
        Update: {
          supplierId?: string;
          contactId?: string;
          supplierLocationId?: string | null;
          userId?: string | null;
          id?: string;
        };
      };
      supplierLocation: {
        Row: {
          supplierId: string;
          addressId: string;
          id: string;
        };
        Insert: {
          supplierId: string;
          addressId: string;
          id?: string;
        };
        Update: {
          supplierId?: string;
          addressId?: string;
          id?: string;
        };
      };
      supplierStatus: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      supplierType: {
        Row: {
          name: string;
          updatedAt: string | null;
          id: string;
          color: string | null;
          protected: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          updatedAt?: string | null;
          id?: string;
          color?: string | null;
          protected?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          updatedAt?: string | null;
          id?: string;
          color?: string | null;
          protected?: boolean;
          createdAt?: string;
        };
      };
      unitOfMeasure: {
        Row: {
          code: string;
          name: string;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          code: string;
          name: string;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          code?: string;
          name?: string;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          active?: boolean;
          createdAt?: string;
        };
      };
      user: {
        Row: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          avatarUrl: string | null;
          emailVerified: string | null;
          updatedAt: string | null;
          fullName: string | null;
          about: string;
          active: boolean | null;
          createdAt: string;
        };
        Insert: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          avatarUrl?: string | null;
          emailVerified?: string | null;
          updatedAt?: string | null;
          fullName?: string | null;
          about?: string;
          active?: boolean | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          firstName?: string;
          lastName?: string;
          avatarUrl?: string | null;
          emailVerified?: string | null;
          updatedAt?: string | null;
          fullName?: string | null;
          about?: string;
          active?: boolean | null;
          createdAt?: string;
        };
      };
      userAttribute: {
        Row: {
          name: string;
          userAttributeCategoryId: string;
          attributeDataTypeId: number;
          listOptions: string[] | null;
          createdBy: string;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          sortOrder: number;
          canSelfManage: boolean | null;
          active: boolean | null;
          createdAt: string;
        };
        Insert: {
          name: string;
          userAttributeCategoryId: string;
          attributeDataTypeId: number;
          listOptions?: string[] | null;
          createdBy: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          sortOrder?: number;
          canSelfManage?: boolean | null;
          active?: boolean | null;
          createdAt?: string;
        };
        Update: {
          name?: string;
          userAttributeCategoryId?: string;
          attributeDataTypeId?: number;
          listOptions?: string[] | null;
          createdBy?: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          sortOrder?: number;
          canSelfManage?: boolean | null;
          active?: boolean | null;
          createdAt?: string;
        };
      };
      userAttributeCategory: {
        Row: {
          name: string;
          createdBy: string;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          public: boolean | null;
          protected: boolean | null;
          active: boolean | null;
          createdAt: string;
        };
        Insert: {
          name: string;
          createdBy: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          public?: boolean | null;
          protected?: boolean | null;
          active?: boolean | null;
          createdAt?: string;
        };
        Update: {
          name?: string;
          createdBy?: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          public?: boolean | null;
          protected?: boolean | null;
          active?: boolean | null;
          createdAt?: string;
        };
      };
      userAttributeValue: {
        Row: {
          userAttributeId: string;
          userId: string;
          valueBoolean: boolean | null;
          valueDate: string | null;
          valueNumeric: number | null;
          valueText: string | null;
          valueUser: string | null;
          createdBy: string;
          updatedAt: string | null;
          updatedBy: string | null;
          id: string;
          createdAt: string;
        };
        Insert: {
          userAttributeId: string;
          userId: string;
          valueBoolean?: boolean | null;
          valueDate?: string | null;
          valueNumeric?: number | null;
          valueText?: string | null;
          valueUser?: string | null;
          createdBy: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
        Update: {
          userAttributeId?: string;
          userId?: string;
          valueBoolean?: boolean | null;
          valueDate?: string | null;
          valueNumeric?: number | null;
          valueText?: string | null;
          valueUser?: string | null;
          createdBy?: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
          id?: string;
          createdAt?: string;
        };
      };
      userNote: {
        Row: {
          userId: string;
          note: string;
          id: string;
          createdBy: string;
          updatedAt: string | null;
          noteRichText: Json;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          userId: string;
          note: string;
          id?: string;
          createdBy: string;
          updatedAt?: string | null;
          noteRichText?: Json;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          userId?: string;
          note?: string;
          id?: string;
          createdBy?: string;
          updatedAt?: string | null;
          noteRichText?: Json;
          active?: boolean;
          createdAt?: string;
        };
      };
      workCell: {
        Row: {
          name: string;
          description: string | null;
          departmentId: string;
          locationId: string | null;
          workCellTypeId: string;
          activeDate: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          defaultStandardFactor: Database["public"]["Enums"]["factor"];
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          departmentId: string;
          locationId?: string | null;
          workCellTypeId: string;
          activeDate?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          defaultStandardFactor?: Database["public"]["Enums"]["factor"];
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          departmentId?: string;
          locationId?: string | null;
          workCellTypeId?: string;
          activeDate?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          defaultStandardFactor?: Database["public"]["Enums"]["factor"];
          active?: boolean;
          createdAt?: string;
        };
      };
      workCellType: {
        Row: {
          name: string;
          description: string | null;
          requiredAbility: string | null;
          createdBy: string;
          updatedBy: string | null;
          updatedAt: string | null;
          id: string;
          color: string;
          active: boolean;
          createdAt: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          requiredAbility?: string | null;
          createdBy: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          active?: boolean;
          createdAt?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          requiredAbility?: string | null;
          createdBy?: string;
          updatedBy?: string | null;
          updatedAt?: string | null;
          id?: string;
          color?: string;
          active?: boolean;
          createdAt?: string;
        };
      };
    };
    Views: {
      contractors_query: {
        Row: {
          supplierContactId: string | null;
          active: boolean | null;
          hoursPerWeek: number | null;
          supplierId: string | null;
          supplierName: string | null;
          firstName: string | null;
          lastName: string | null;
          email: string | null;
          abilityIds: string[] | null;
        };
      };
      group_member: {
        Row: {
          id: number | null;
          name: string | null;
          isIdentityGroup: boolean | null;
          isEmployeeTypeGroup: boolean | null;
          isCustomerOrgGroup: boolean | null;
          isCustomerTypeGroup: boolean | null;
          isSupplierOrgGroup: boolean | null;
          isSupplierTypeGroup: boolean | null;
          groupId: string | null;
          memberGroupId: string | null;
          memberUserId: string | null;
          user: Json | null;
        };
      };
      groups_recursive: {
        Row: {
          groupId: string | null;
          name: string | null;
          parentId: string | null;
          isIdentityGroup: boolean | null;
          isEmployeeTypeGroup: boolean | null;
          isCustomerOrgGroup: boolean | null;
          isCustomerTypeGroup: boolean | null;
          isSupplierOrgGroup: boolean | null;
          isSupplierTypeGroup: boolean | null;
          user: Json | null;
        };
      };
      groups_view: {
        Row: {
          id: string | null;
          isEmployeeTypeGroup: boolean | null;
          isCustomerOrgGroup: boolean | null;
          isCustomerTypeGroup: boolean | null;
          isSupplierOrgGroup: boolean | null;
          isSupplierTypeGroup: boolean | null;
          name: string | null;
          parentId: string | null;
          users: Json | null;
        };
      };
      holiday_years: {
        Row: {
          year: number | null;
        };
      };
      partners_query: {
        Row: {
          supplierLocationId: string | null;
          active: boolean | null;
          hoursPerWeek: number | null;
          supplierId: string | null;
          supplierName: string | null;
          city: string | null;
          state: string | null;
          abilityIds: string[] | null;
        };
      };
    };
    Functions: {
      _xid_machine_id: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      delete_claim: {
        Args: { uid: string; claim: string };
        Returns: string;
      };
      get_claim: {
        Args: { uid: string; claim: string };
        Returns: Json;
      };
      get_claims: {
        Args: { uid: string };
        Returns: Json;
      };
      get_my_claim: {
        Args: { claim: string };
        Returns: Json;
      };
      get_my_claims: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      groups_for_user: {
        Args: { uid: string };
        Returns: Json;
      };
      groups_query: {
        Args: { _name: string; _uid: string };
        Returns: {
          id: string;
          name: string;
          parentId: string;
          isEmployeeTypeGroup: boolean;
          isCustomerOrgGroup: boolean;
          isCustomerTypeGroup: boolean;
          isSupplierOrgGroup: boolean;
          isSupplierTypeGroup: boolean;
          users: Json;
        }[];
      };
      is_claims_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      set_claim: {
        Args: { uid: string; claim: string; value: Json };
        Returns: string;
      };
      users_for_groups: {
        Args: { groups: string[] };
        Returns: Json;
      };
      xid: {
        Args: { _at: string };
        Returns: unknown;
      };
      xid_counter: {
        Args: { _xid: unknown };
        Returns: number;
      };
      xid_decode: {
        Args: { _xid: unknown };
        Returns: number[];
      };
      xid_encode: {
        Args: { _id: number[] };
        Returns: unknown;
      };
      xid_machine: {
        Args: { _xid: unknown };
        Returns: number[];
      };
      xid_pid: {
        Args: { _xid: unknown };
        Returns: number;
      };
      xid_time: {
        Args: { _xid: unknown };
        Returns: string;
      };
    };
    Enums: {
      consolidatedRate: "Average" | "Current" | "Historical";
      documentTransactionType:
        | "Archive"
        | "CategorizeComment"
        | "Download"
        | "EditFile"
        | "EditMeta"
        | "EditPermissions"
        | "Label"
        | "Preview"
        | "Rename"
        | "Replace"
        | "Upload";
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
        | "Total Minutes";
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
        | "Other Expense";
      glAccountType: "Balance Sheet" | "Income Statement";
      glNormalBalance: "Debit" | "Credit";
      partCostingMethod: "Standard" | "Average" | "LIFO" | "FIFO";
      partManufacturingPolicy: "Make to Order" | "Make to Stock";
      partReorderingPolicy:
        | "Manual Reorder"
        | "Demand-Based Reorder"
        | "Fixed Reorder Quantity"
        | "Maximum Quantity";
      partReplenishmentSystem: "Buy" | "Make" | "Buy and Make";
      partType: "Inventory" | "Non-Inventory" | "Service";
      searchEntity:
        | "Resource"
        | "Person"
        | "Customer"
        | "Supplier"
        | "Job"
        | "Part"
        | "Purchase Order"
        | "Sales Order"
        | "Document";
    };
  };
}
