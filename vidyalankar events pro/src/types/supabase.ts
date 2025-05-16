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
          name: string
          email: string
          role: 'student' | 'faculty' | 'admin'
          contact: string | null
          department: string | null
          year: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'student' | 'faculty' | 'admin'
          contact?: string | null
          department?: string | null
          year?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'student' | 'faculty' | 'admin'
          contact?: string | null
          department?: string | null
          year?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          category: string
          capacity: number
          price: string
          image_url: string | null
          organizer_id: string
          organizer_name: string
          organizer_contact: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          location: string
          category: string
          capacity: number
          price?: string
          image_url?: string | null
          organizer_id: string
          organizer_name: string
          organizer_contact?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          category?: string
          capacity?: number
          price?: string
          image_url?: string | null
          organizer_id?: string
          organizer_name?: string
          organizer_contact?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          name: string
          email: string
          phone: string
          roll_number: string
          department: string
          year: string
          special_requirements: string | null
          ticket_id: string
          status: 'confirmed' | 'cancelled' | 'attended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          name: string
          email: string
          phone: string
          roll_number: string
          department: string
          year: string
          special_requirements?: string | null
          ticket_id: string
          status?: 'confirmed' | 'cancelled' | 'attended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string
          roll_number?: string
          department?: string
          year?: string
          special_requirements?: string | null
          ticket_id?: string
          status?: 'confirmed' | 'cancelled' | 'attended'
          created_at?: string
          updated_at?: string
        }
      }
      event_approvals: {
        Row: {
          id: string
          event_id: string
          admin_id: string | null
          status: 'pending' | 'approved' | 'rejected'
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          admin_id?: string | null
          status: 'pending' | 'approved' | 'rejected'
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          admin_id?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}