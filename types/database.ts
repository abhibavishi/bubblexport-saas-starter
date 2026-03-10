export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: "admin" | "member"
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "member"
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "admin" | "member"
          stripe_customer_id?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          status: "active" | "paused" | "completed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          status?: "active" | "paused" | "completed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          status?: "active" | "paused" | "completed"
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          plan: string
          status: string
          current_period_end: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          plan?: string
          status: string
          current_period_end?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          plan?: string
          status?: string
          current_period_end?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: "admin" | "member"
      project_status: "active" | "paused" | "completed"
    }
  }
}
