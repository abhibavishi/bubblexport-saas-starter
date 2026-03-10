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
        Relationships: []
      }
      channels: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          id: string
          title: string
          category: string
          price: number
          image_url: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          price?: number
          image_url?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          price?: number
          image_url?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'liked' | 'commented' | 'mentioned' | 'followed'
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'liked' | 'commented' | 'mentioned' | 'followed'
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'liked' | 'commented' | 'mentioned' | 'followed'
          content?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          status: "active" | "paused" | "completed"
          due_date: string | null
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          status?: "active" | "paused" | "completed"
          due_date?: string | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          status?: "active" | "paused" | "completed"
          due_date?: string | null
          member_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          status: 'todo' | 'in-progress' | 'done'
          assignee_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          status?: 'todo' | 'in-progress' | 'done'
          assignee_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          status?: 'todo' | 'in-progress' | 'done'
          assignee_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          method: string
          status: 'paid' | 'pending' | 'failed'
          fees: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          method?: string
          status?: 'paid' | 'pending' | 'failed'
          fees?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          method?: string
          status?: 'paid' | 'pending' | 'failed'
          fees?: number
          created_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {
      user_role: "admin" | "member"
      project_status: "active" | "paused" | "completed"
    }
  }
}
