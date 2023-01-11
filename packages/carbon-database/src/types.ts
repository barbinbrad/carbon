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
      _prisma_migrations: {
        Row: {
          id: string
          checksum: string
          finished_at: string | null
          migration_name: string
          logs: string | null
          rolled_back_at: string | null
          started_at: string
          applied_steps_count: number
        }
        Insert: {
          id: string
          checksum: string
          finished_at?: string | null
          migration_name: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
        Update: {
          id?: string
          checksum?: string
          finished_at?: string | null
          migration_name?: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
      }
      address: {
        Row: {
          id: number
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          state: string | null
          countryId: number | null
          phone: string | null
          fax: string | null
        }
        Insert: {
          id?: number
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          countryId?: number | null
          phone?: string | null
          fax?: string | null
        }
        Update: {
          id?: number
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
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
          id: number
          firstName: string | null
          lastName: string | null
          title: string | null
          email: string | null
          mobilePhone: string | null
          homePhone: string | null
          workPhone: string | null
          fax: string | null
          addressLine1: string | null
          addressLine2: string | null
          city: string | null
          state: string | null
          countryId: number | null
          birthday: string | null
        }
        Insert: {
          id?: number
          firstName?: string | null
          lastName?: string | null
          title?: string | null
          email?: string | null
          mobilePhone?: string | null
          homePhone?: string | null
          workPhone?: string | null
          fax?: string | null
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          countryId?: number | null
          birthday?: string | null
        }
        Update: {
          id?: number
          firstName?: string | null
          lastName?: string | null
          title?: string | null
          email?: string | null
          mobilePhone?: string | null
          homePhone?: string | null
          workPhone?: string | null
          fax?: string | null
          addressLine1?: string | null
          addressLine2?: string | null
          city?: string | null
          state?: string | null
          countryId?: number | null
          birthday?: string | null
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
      customerStatus: {
        Row: {
          id: number
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: number
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: number
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      customerType: {
        Row: {
          id: number
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: number
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: number
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
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          isIdentityGroup?: boolean
          isEmployeeTypeGroup?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          isIdentityGroup?: boolean
          isEmployeeTypeGroup?: boolean
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
      supplier: {
        Row: {
          id: string
          name: string
          description: string | null
          supplierTypeId: number | null
          supplierStatusId: number | null
          taxId: string | null
          taxable: boolean | null
          established: string | null
          accountManagerId: string | null
          logo: string | null
          website: string | null
          twitter: string | null
          facebook: string | null
          instagram: string | null
          linkedin: string | null
          github: string | null
          youtube: string | null
          twitch: string | null
          discord: string | null
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          supplierTypeId?: number | null
          supplierStatusId?: number | null
          taxId?: string | null
          taxable?: boolean | null
          established?: string | null
          accountManagerId?: string | null
          logo?: string | null
          website?: string | null
          twitter?: string | null
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          github?: string | null
          youtube?: string | null
          twitch?: string | null
          discord?: string | null
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          supplierTypeId?: number | null
          supplierStatusId?: number | null
          taxId?: string | null
          taxable?: boolean | null
          established?: string | null
          accountManagerId?: string | null
          logo?: string | null
          website?: string | null
          twitter?: string | null
          facebook?: string | null
          instagram?: string | null
          linkedin?: string | null
          github?: string | null
          youtube?: string | null
          twitch?: string | null
          discord?: string | null
          createdAt?: string
          updatedAt?: string | null
        }
      }
      supplierContact: {
        Row: {
          id: number
          supplierId: string
          contactId: number
          supplierLocationId: number | null
        }
        Insert: {
          id?: number
          supplierId: string
          contactId: number
          supplierLocationId?: number | null
        }
        Update: {
          id?: number
          supplierId?: string
          contactId?: number
          supplierLocationId?: number | null
        }
      }
      supplierLocation: {
        Row: {
          id: number
          supplierId: string
          addressId: number
        }
        Insert: {
          id?: number
          supplierId: string
          addressId: number
        }
        Update: {
          id?: number
          supplierId?: string
          addressId?: number
        }
      }
      supplierStatus: {
        Row: {
          id: number
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: number
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: number
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      supplierType: {
        Row: {
          id: number
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: number
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: number
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
          id: number
          name: string
          sortOrder: number
          userAttributeCategoryId: number
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
          id?: number
          name: string
          sortOrder?: number
          userAttributeCategoryId: number
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
          id?: number
          name?: string
          sortOrder?: number
          userAttributeCategoryId?: number
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
          id: number
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
          id?: number
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
          id?: number
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
          id: number
          userAttributeId: number
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
          id?: number
          userAttributeId: number
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
          id?: number
          userAttributeId?: number
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
    }
    Views: {
      group_member: {
        Row: {
          id: number | null
          name: string | null
          isIdentityGroup: boolean | null
          isEmployeeTypeGroup: boolean | null
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
          user: Json | null
        }
      }
      groups_view: {
        Row: {
          id: string | null
          isEmployeeTypeGroup: boolean | null
          name: string | null
          parentId: string | null
          users: Json | null
        }
      }
    }
    Functions: {
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
    }
    Enums: {
      [_ in never]: never
    }
  }
}

