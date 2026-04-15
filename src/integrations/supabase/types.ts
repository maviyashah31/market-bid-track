export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          company: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_default: boolean | null
          label: string | null
          phone: string
          postal_code: string | null
          province: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone: string
          postal_code?: string | null
          province?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          company?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          phone?: string
          postal_code?: string | null
          province?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          participant_1: string
          participant_2: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_1: string
          participant_2: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_participant_1_fkey"
            columns: ["participant_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_fkey"
            columns: ["participant_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          content: string
          created_at: string | null
          dispute_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          dispute_id: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          dispute_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          buyer_id: string
          created_at: string | null
          description: string
          dispute_number: string
          evidence_urls: string[] | null
          id: string
          order_id: string
          reason: string
          resolution: string | null
          seller_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          description: string
          dispute_number: string
          evidence_urls?: string[] | null
          id?: string
          order_id: string
          reason: string
          resolution?: string | null
          seller_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          description?: string
          dispute_number?: string
          evidence_urls?: string[] | null
          id?: string
          order_id?: string
          reason?: string
          resolution?: string | null
          seller_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_image_snapshot: string | null
          product_name_snapshot: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_image_snapshot?: string | null
          product_name_snapshot: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_image_snapshot?: string | null
          product_name_snapshot?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          cancelled_at: string | null
          commission_amount: number | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string | null
          payment_status: string | null
          seller_id: string
          shipped_at: string | null
          shipping_address_snapshot: Json | null
          shipping_cost: number | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          cancelled_at?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          seller_id: string
          shipped_at?: string | null
          shipping_address_snapshot?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          cancelled_at?: string | null
          commission_amount?: number | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          seller_id?: string
          shipped_at?: string | null
          shipping_address_snapshot?: Json | null
          shipping_cost?: number | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string | null
          description: string | null
          id: string
          method: string | null
          order_id: string | null
          seller_id: string | null
          status: string | null
          type: string
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string | null
          order_id?: string | null
          seller_id?: string | null
          status?: string | null
          type: string
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string | null
          order_id?: string | null
          seller_id?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pricing_tiers: {
        Row: {
          id: string
          max_quantity: number | null
          min_quantity: number
          price_per_unit: number
          product_id: string
        }
        Insert: {
          id?: string
          max_quantity?: number | null
          min_quantity: number
          price_per_unit: number
          product_id: string
        }
        Update: {
          id?: string
          max_quantity?: number | null
          min_quantity?: number
          price_per_unit?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          max_price: number | null
          min_price: number
          moq: number
          name: string
          seller_id: string
          sku: string | null
          slug: string
          specifications: Json | null
          status: string
          stock_quantity: number | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          max_price?: number | null
          min_price: number
          moq?: number
          name: string
          seller_id: string
          sku?: string | null
          slug: string
          specifications?: Json | null
          status?: string
          stock_quantity?: number | null
          unit?: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          max_price?: number | null
          min_price?: number
          moq?: number
          name?: string
          seller_id?: string
          sku?: string | null
          slug?: string
          specifications?: Json | null
          status?: string
          stock_quantity?: number | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          buyer_id: string
          comment: string | null
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string
          rating: number
          seller_id: string
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id: string
          rating: number
          seller_id: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          seller_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_responses: {
        Row: {
          created_at: string | null
          delivery_days: number
          id: string
          notes: string | null
          price_per_unit: number
          rfq_id: string
          seller_id: string
          status: string | null
          total_price: number
        }
        Insert: {
          created_at?: string | null
          delivery_days: number
          id?: string
          notes?: string | null
          price_per_unit: number
          rfq_id: string
          seller_id: string
          status?: string | null
          total_price: number
        }
        Update: {
          created_at?: string | null
          delivery_days?: number
          id?: string
          notes?: string | null
          price_per_unit?: number
          rfq_id?: string
          seller_id?: string
          status?: string | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "rfq_responses_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_responses_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          buyer_id: string
          category_id: string | null
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          image_urls: string[] | null
          quantity: number
          rfq_number: string
          status: string | null
          title: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id: string
          category_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          image_urls?: string[] | null
          quantity: number
          rfq_number: string
          status?: string | null
          title: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          buyer_id?: string
          category_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          image_urls?: string[] | null
          quantity?: number
          rfq_number?: string
          status?: string | null
          title?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          seller_id: string
          total_earned: number | null
          total_withdrawn: number | null
          updated_at: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          seller_id: string
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          seller_id?: string
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_wallets_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_onboarding: {
        Row: {
          account_title: string | null
          bank_name: string | null
          business_address: string | null
          business_city: string | null
          business_description: string | null
          business_name: string | null
          business_phone: string | null
          business_province: string | null
          business_registration_url: string | null
          business_type: string | null
          cnic_back_url: string | null
          cnic_front_url: string | null
          created_at: string
          documents_uploaded: boolean
          iban: string | null
          id: string
          ntn_url: string | null
          onboarding_completed_at: string | null
          payment_terms_accepted: boolean
          products_added: boolean
          profile_completed: boolean
          profile_reviewed_at: string | null
          profile_status: string
          updated_at: string
          user_id: string
          whatsapp_number: string | null
        }
        Insert: {
          account_title?: string | null
          bank_name?: string | null
          business_address?: string | null
          business_city?: string | null
          business_description?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_province?: string | null
          business_registration_url?: string | null
          business_type?: string | null
          cnic_back_url?: string | null
          cnic_front_url?: string | null
          created_at?: string
          documents_uploaded?: boolean
          iban?: string | null
          id?: string
          ntn_url?: string | null
          onboarding_completed_at?: string | null
          payment_terms_accepted?: boolean
          products_added?: boolean
          profile_completed?: boolean
          profile_reviewed_at?: string | null
          profile_status?: string
          updated_at?: string
          user_id: string
          whatsapp_number?: string | null
        }
        Update: {
          account_title?: string | null
          bank_name?: string | null
          business_address?: string | null
          business_city?: string | null
          business_description?: string | null
          business_name?: string | null
          business_phone?: string | null
          business_province?: string | null
          business_registration_url?: string | null
          business_type?: string | null
          cnic_back_url?: string | null
          cnic_front_url?: string | null
          created_at?: string
          documents_uploaded?: boolean
          iban?: string | null
          id?: string
          ntn_url?: string | null
          onboarding_completed_at?: string | null
          payment_terms_accepted?: boolean
          products_added?: boolean
          profile_completed?: boolean
          profile_reviewed_at?: string | null
          profile_status?: string
          updated_at?: string
          user_id?: string
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_onboarding_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
