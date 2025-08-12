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
      aided_persons: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          relationship: string | null
          medical_info: string | null
          emergency_contact: string | null
          address: string | null
          social_security_number: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          relationship?: string | null
          medical_info?: string | null
          emergency_contact?: string | null
          address?: string | null
          social_security_number?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          relationship?: string | null
          medical_info?: string | null
          emergency_contact?: string | null
          address?: string | null
          social_security_number?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      aidant_roles: {
        Row: {
          id: string
          aidant_id: string | null
          aided_person_id: string | null
          role: 'lecture' | 'contributeur' | 'admin'
          invited_by: string | null
          invited_at: string
          accepted_at: string | null
          status: 'pending' | 'accepted' | 'declined' | 'expired'
        }
        Insert: {
          id?: string
          aidant_id?: string | null
          aided_person_id?: string | null
          role?: 'lecture' | 'contributeur' | 'admin'
          invited_by?: string | null
          invited_at?: string
          accepted_at?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
        }
        Update: {
          id?: string
          aidant_id?: string | null
          aided_person_id?: string | null
          role?: 'lecture' | 'contributeur' | 'admin'
          invited_by?: string | null
          invited_at?: string
          accepted_at?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
        }
      }
      appointments: {
        Row: {
          id: string
          title: string
          description: string | null
          appointment_date: string
          duration: number
          location: string
          type: 'consultation' | 'hospital' | 'teleconsultation' | 'emergency' | 'analysis' | 'specialist'
          aided_person_id: string | null
          accompanied_by: string | null
          doctor_name: string | null
          specialty: string | null
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          reminder_enabled: boolean
          reminder_minutes: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          appointment_date: string
          duration?: number
          location: string
          type?: 'consultation' | 'hospital' | 'teleconsultation' | 'emergency' | 'analysis' | 'specialist'
          aided_person_id?: string | null
          accompanied_by?: string | null
          doctor_name?: string | null
          specialty?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          reminder_enabled?: boolean
          reminder_minutes?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          appointment_date?: string
          duration?: number
          location?: string
          type?: 'consultation' | 'hospital' | 'teleconsultation' | 'emergency' | 'analysis' | 'specialist'
          aided_person_id?: string | null
          accompanied_by?: string | null
          doctor_name?: string | null
          specialty?: string | null
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          reminder_enabled?: boolean
          reminder_minutes?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          file_type: string
          file_size: number
          category: 'medical' | 'administrative' | 'insurance' | 'identity' | 'other'
          aided_person_id: string | null
          appointment_id: string | null
          procedure_id: string | null
          file_url: string
          description: string | null
          expiration_date: string | null
          tags: string[]
          uploaded_by: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          name: string
          file_type: string
          file_size: number
          category?: 'medical' | 'administrative' | 'insurance' | 'identity' | 'other'
          aided_person_id?: string | null
          appointment_id?: string | null
          procedure_id?: string | null
          file_url: string
          description?: string | null
          expiration_date?: string | null
          tags?: string[]
          uploaded_by?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          name?: string
          file_type?: string
          file_size?: number
          category?: 'medical' | 'administrative' | 'insurance' | 'identity' | 'other'
          aided_person_id?: string | null
          appointment_id?: string | null
          procedure_id?: string | null
          file_url?: string
          description?: string | null
          expiration_date?: string | null
          tags?: string[]
          uploaded_by?: string | null
          uploaded_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          email: string
          aided_person_id: string | null
          role: 'lecture' | 'contributeur' | 'admin'
          invited_by: string | null
          invited_at: string
          expires_at: string
          token: string
          status: 'pending' | 'accepted' | 'declined' | 'expired'
        }
        Insert: {
          id?: string
          email: string
          aided_person_id?: string | null
          role?: 'lecture' | 'contributeur' | 'admin'
          invited_by?: string | null
          invited_at?: string
          expires_at?: string
          token?: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
        }
        Update: {
          id?: string
          email?: string
          aided_person_id?: string | null
          role?: 'lecture' | 'contributeur' | 'admin'
          invited_by?: string | null
          invited_at?: string
          expires_at?: string
          token?: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
        }
      }
      notifications: {
        Row: {
          id: string
          type: 'appointment' | 'document' | 'deadline' | 'collaboration' | 'reminder'
          title: string
          message: string
          user_id: string | null
          read: boolean
          priority: 'low' | 'medium' | 'high' | 'urgent'
          action_url: string | null
          scheduled_for: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'appointment' | 'document' | 'deadline' | 'collaboration' | 'reminder'
          title: string
          message: string
          user_id?: string | null
          read?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          action_url?: string | null
          scheduled_for?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'appointment' | 'document' | 'deadline' | 'collaboration' | 'reminder'
          title?: string
          message?: string
          user_id?: string | null
          read?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          action_url?: string | null
          scheduled_for?: string | null
          created_at?: string
        }
      }
      procedure_steps: {
        Row: {
          id: string
          procedure_id: string | null
          title: string
          description: string | null
          step_order: number
          completed: boolean
          due_date: string | null
          external_link: string | null
          notes: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          procedure_id?: string | null
          title: string
          description?: string | null
          step_order: number
          completed?: boolean
          due_date?: string | null
          external_link?: string | null
          notes?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          procedure_id?: string | null
          title?: string
          description?: string | null
          step_order?: number
          completed?: boolean
          due_date?: string | null
          external_link?: string | null
          notes?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
        }
      }
      procedures: {
        Row: {
          id: string
          title: string
          description: string
          category: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other'
          language: string
          aided_person_id: string | null
          progress: number
          status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category?: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other'
          language?: string
          aided_person_id?: string | null
          progress?: number
          status?: 'not_started' | 'in_progress' | 'completed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other'
          language?: string
          aided_person_id?: string | null
          progress?: number
          status?: 'not_started' | 'in_progress' | 'completed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          account_type: 'aidant' | 'proche_aide'
          avatar_url: string | null
          email_verified: boolean
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          account_type?: 'aidant' | 'proche_aide'
          avatar_url?: string | null
          email_verified?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          account_type?: 'aidant' | 'proche_aide'
          avatar_url?: string | null
          email_verified?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: 'aidant' | 'proche_aide'
      aidant_role: 'lecture' | 'contributeur' | 'admin'
      appointment_status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
      appointment_type: 'consultation' | 'hospital' | 'teleconsultation' | 'emergency' | 'analysis' | 'specialist'
      document_category: 'medical' | 'administrative' | 'insurance' | 'identity' | 'other'
      invitation_status: 'pending' | 'accepted' | 'declined' | 'expired'
      notification_type: 'appointment' | 'document' | 'deadline' | 'collaboration' | 'reminder'
      priority_level: 'low' | 'medium' | 'high' | 'urgent'
      procedure_category: 'caf' | 'ameli' | 'cnav' | 'prefecture' | 'mdph' | 'other'
      procedure_status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}