export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          id: string
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          state: string | null
          postalCode: string | null
          countryId: number | null
          phone: string | null
          fax: string | null
        }
        Insert: {
          id?: string
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          postalCode?: string | null
          countryId?: number | null
          phone?: string | null
          fax?: string | null
        }
        Update: {
          id?: string
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          postalCode?: string | null
          countryId?: number | null
          phone?: string | null
          fax?: string | null
        }
      }
      attributeDataType: {
        Row: {
          id: number
          label: string
          isBoolean: boolean
          isDate: boolean
          isList: boolean
          isNumeric: boolean
          isText: boolean
          isUser: boolean
        }
        Insert: {
          id?: number
          label: string
          isBoolean?: boolean
          isDate?: boolean
          isList?: boolean
          isNumeric?: boolean
          isText?: boolean
          isUser?: boolean
        }
        Update: {
          id?: number
          label?: string
          isBoolean?: boolean
          isDate?: boolean
          isList?: boolean
          isNumeric?: boolean
          isText?: boolean
          isUser?: boolean
        }
      }
      contact: {
        Row: {
          id: string
          firstName: string
          lastName: string
          email: string
          title: string | null
          mobilePhone: string | null
          homePhone: string | null
          workPhone: string | null
          fax: string | null
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          state: string | null
          postalCode: string | null
          countryId: number | null
          birthday: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          firstName: string
          lastName: string
          email: string
          title?: string | null
          mobilePhone?: string | null
          homePhone?: string | null
          workPhone?: string | null
          fax?: string | null
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          postalCode?: string | null
          countryId?: number | null
          birthday?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          firstName?: string
          lastName?: string
          email?: string
          title?: string | null
          mobilePhone?: string | null
          homePhone?: string | null
          workPhone?: string | null
          fax?: string | null
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          postalCode?: string | null
          countryId?: number | null
          birthday?: string | null
          notes?: string | null
        }
      }
      country: {
        Row: {
          id: number
          name: string
          code: string
        }
        Insert: {
          id?: number
          name: string
          code: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
        }
      }
      customer: {
        Row: {
          id: string
          name: string
          description: string | null
          customerTypeId: string | null
          customerStatusId: string | null
          taxId: string | null
          accountManagerId: string | null
          logo: string | null
          createdAt: string
          createdBy: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          customerTypeId?: string | null
          customerStatusId?: string | null
          taxId?: string | null
          accountManagerId?: string | null
          logo?: string | null
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          customerTypeId?: string | null
          customerStatusId?: string | null
          taxId?: string | null
          accountManagerId?: string | null
          logo?: string | null
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
      }
      customerAccount: {
        Row: {
          id: string
          customerId: string
        }
        Insert: {
          id: string
          customerId: string
        }
        Update: {
          id?: string
          customerId?: string
        }
      }
      customerContact: {
        Row: {
          id: string
          customerId: string
          contactId: string
          customerLocationId: string | null
          userId: string | null
        }
        Insert: {
          id?: string
          customerId: string
          contactId: string
          customerLocationId?: string | null
          userId?: string | null
        }
        Update: {
          id?: string
          customerId?: string
          contactId?: string
          customerLocationId?: string | null
          userId?: string | null
        }
      }
      customerLocation: {
        Row: {
          id: string
          customerId: string
          addressId: string
        }
        Insert: {
          id?: string
          customerId: string
          addressId: string
        }
        Update: {
          id?: string
          customerId?: string
          addressId?: string
        }
      }
      customerStatus: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      customerType: {
        Row: {
          id: string
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      employee: {
        Row: {
          id: string
          employeeTypeId: string
        }
        Insert: {
          id: string
          employeeTypeId: string
        }
        Update: {
          id?: string
          employeeTypeId?: string
        }
      }
      employeeType: {
        Row: {
          id: string
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      employeeTypePermission: {
        Row: {
          employeeTypeId: string
          featureId: string
          create: boolean
          delete: boolean
          update: boolean
          view: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          employeeTypeId: string
          featureId: string
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          employeeTypeId?: string
          featureId?: string
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      feature: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      group: {
        Row: {
          id: string
          name: string
          isIdentityGroup: boolean
          isEmployeeTypeGroup: boolean
          isCustomerOrgGroup: boolean
          isCustomerTypeGroup: boolean
          isSupplierTypeGroup: boolean
          isSupplierOrgGroup: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          isIdentityGroup?: boolean
          isEmployeeTypeGroup?: boolean
          isCustomerOrgGroup?: boolean
          isCustomerTypeGroup?: boolean
          isSupplierTypeGroup?: boolean
          isSupplierOrgGroup?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          isIdentityGroup?: boolean
          isEmployeeTypeGroup?: boolean
          isCustomerOrgGroup?: boolean
          isCustomerTypeGroup?: boolean
          isSupplierTypeGroup?: boolean
          isSupplierOrgGroup?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      membership: {
        Row: {
          id: number
          groupId: string
          memberGroupId: string | null
          memberUserId: string | null
        }
        Insert: {
          id?: number
          groupId: string
          memberGroupId?: string | null
          memberUserId?: string | null
        }
        Update: {
          id?: number
          groupId?: string
          memberGroupId?: string | null
          memberUserId?: string | null
        }
      }
      search: {
        Row: {
          id: number
          name: string
          description: string | null
          entity: Database["public"]["Enums"]["search_entity"] | null
          uuid: string | null
          link: string
          fts: unknown | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          entity?: Database["public"]["Enums"]["search_entity"] | null
          uuid?: string | null
          link: string
          fts?: unknown | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          entity?: Database["public"]["Enums"]["search_entity"] | null
          uuid?: string | null
          link?: string
          fts?: unknown | null
        }
      }
      supplier: {
        Row: {
          id: string
          name: string
          description: string | null
          supplierTypeId: string | null
          supplierStatusId: string | null
          taxId: string | null
          accountManagerId: string | null
          logo: string | null
          createdAt: string
          createdBy: string | null
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          supplierTypeId?: string | null
          supplierStatusId?: string | null
          taxId?: string | null
          accountManagerId?: string | null
          logo?: string | null
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          supplierTypeId?: string | null
          supplierStatusId?: string | null
          taxId?: string | null
          accountManagerId?: string | null
          logo?: string | null
          createdAt?: string
          createdBy?: string | null
          updatedAt?: string | null
          updatedBy?: string | null
        }
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
      }
      supplierContact: {
        Row: {
          id: string
          supplierId: string
          contactId: string
          supplierLocationId: string | null
          userId: string | null
        }
        Insert: {
          id?: string
          supplierId: string
          contactId: string
          supplierLocationId?: string | null
          userId?: string | null
        }
        Update: {
          id?: string
          supplierId?: string
          contactId?: string
          supplierLocationId?: string | null
          userId?: string | null
        }
      }
      supplierLocation: {
        Row: {
          id: string
          supplierId: string
          addressId: string
        }
        Insert: {
          id?: string
          supplierId: string
          addressId: string
        }
        Update: {
          id?: string
          supplierId?: string
          addressId?: string
        }
      }
      supplierStatus: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      supplierType: {
        Row: {
          id: string
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      user: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          fullName: string | null
          about: string
          avatarUrl: string | null
          active: boolean | null
          emailVerified: string | null
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id: string
          email: string
          firstName: string
          lastName: string
          fullName?: string | null
          about?: string
          avatarUrl?: string | null
          active?: boolean | null
          emailVerified?: string | null
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          fullName?: string | null
          about?: string
          avatarUrl?: string | null
          active?: boolean | null
          emailVerified?: string | null
          createdAt?: string
          updatedAt?: string | null
        }
      }
      userAttribute: {
        Row: {
          id: string
          name: string
          sortOrder: number
          userAttributeCategoryId: string
          attributeDataTypeId: number
          listOptions: string[] | null
          canSelfManage: boolean | null
          active: boolean | null
          createdAt: string
          createdBy: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          name: string
          sortOrder?: number
          userAttributeCategoryId: string
          attributeDataTypeId: number
          listOptions?: string[] | null
          canSelfManage?: boolean | null
          active?: boolean | null
          createdAt?: string
          createdBy: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          name?: string
          sortOrder?: number
          userAttributeCategoryId?: string
          attributeDataTypeId?: number
          listOptions?: string[] | null
          canSelfManage?: boolean | null
          active?: boolean | null
          createdAt?: string
          createdBy?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
      }
      userAttributeCategory: {
        Row: {
          id: string
          name: string
          public: boolean | null
          protected: boolean | null
          active: boolean | null
          createdAt: string
          createdBy: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          name: string
          public?: boolean | null
          protected?: boolean | null
          active?: boolean | null
          createdAt?: string
          createdBy: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          name?: string
          public?: boolean | null
          protected?: boolean | null
          active?: boolean | null
          createdAt?: string
          createdBy?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
      }
      userAttributeValue: {
        Row: {
          id: string
          userAttributeId: string
          userId: string
          valueBoolean: boolean | null
          valueDate: string | null
          valueNumeric: number | null
          valueText: string | null
          valueUser: string | null
          createdAt: string
          createdBy: string
          updatedAt: string | null
          updatedBy: string | null
        }
        Insert: {
          id?: string
          userAttributeId: string
          userId: string
          valueBoolean?: boolean | null
          valueDate?: string | null
          valueNumeric?: number | null
          valueText?: string | null
          valueUser?: string | null
          createdAt?: string
          createdBy: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
        Update: {
          id?: string
          userAttributeId?: string
          userId?: string
          valueBoolean?: boolean | null
          valueDate?: string | null
          valueNumeric?: number | null
          valueText?: string | null
          valueUser?: string | null
          createdAt?: string
          createdBy?: string
          updatedAt?: string | null
          updatedBy?: string | null
        }
      }
      userNote: {
        Row: {
          id: string
          userId: string
          note: string
          active: boolean
          createdAt: string
          createdBy: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          userId: string
          note: string
          active?: boolean
          createdAt?: string
          createdBy: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          userId?: string
          note?: string
          active?: boolean
          createdAt?: string
          createdBy?: string
          updatedAt?: string | null
        }
      }
    }
    Views: {
      group_member: {
        Row: {
          id: number | null
          name: string | null
          isIdentityGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          groupId: string | null
          memberGroupId: string | null
          memberUserId: string | null
          user: Json | null
        }
      }
      groups_recursive: {
        Row: {
          groupId: string | null
          name: string | null
          parentId: string | null
          isIdentityGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          user: Json | null
        }
      }
      groups_view: {
        Row: {
          id: string | null
          isEmployeeTypeGroup: boolean | null
          isCustomerOrgGroup: boolean | null
          isCustomerTypeGroup: boolean | null
          isSupplierOrgGroup: boolean | null
          isSupplierTypeGroup: boolean | null
          name: string | null
          parentId: string | null
          users: Json | null
        }
      }
    }
    Functions: {
      _xid_machine_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      delete_claim: {
        Args: { uid: string; claim: string }
        Returns: string
      }
      get_claim: {
        Args: { uid: string; claim: string }
        Returns: Json
      }
      get_claims: {
        Args: { uid: string }
        Returns: Json
      }
      get_my_claim: {
        Args: { claim: string }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      groups_for_user: {
        Args: { uid: string }
        Returns: Json
      }
      groups_query: {
        Args: { _name: string; _uid: string }
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
      set_claim: {
        Args: { uid: string; claim: string; value: Json }
        Returns: string
      }
      users_for_groups: {
        Args: { groups: string[] }
        Returns: Json
      }
      xid: {
        Args: { _at: string }
        Returns: unknown
      }
      xid_counter: {
        Args: { _xid: unknown }
        Returns: number
      }
      xid_decode: {
        Args: { _xid: unknown }
        Returns: number[]
      }
      xid_encode: {
        Args: { _id: number[] }
        Returns: unknown
      }
      xid_machine: {
        Args: { _xid: unknown }
        Returns: number[]
      }
      xid_pid: {
        Args: { _xid: unknown }
        Returns: number
      }
      xid_time: {
        Args: { _xid: unknown }
        Returns: string
      }
    }
    Enums: {
      search_entity:
        | "Resource"
        | "Person"
        | "Customer"
        | "Supplier"
        | "Job"
        | "Part"
        | "Purchase Order"
        | "Sales Order"
        | "Document"
    }
  }
}

