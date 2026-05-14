export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:            string
          email:         string
          display_name:  string
          photo_url:     string | null
          phone_number:  string | null
          role:          'customer'
          auth_provider: 'email' | 'google'
          pending_email: string | null
          notifications: {
            email: boolean
            push:  boolean
            sms:   boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['profiles']['Row'],
          'created_at' | 'updated_at'
        >
        Update: Partial<
          Database['public']['Tables']['profiles']['Insert']
        >
      }
    }
  }
}