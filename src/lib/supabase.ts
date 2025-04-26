import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://edbzcwrxfhgudxaklovz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYnpjd3J4ZmhndWR4YWtsb3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTY2NTUsImV4cCI6MjA2MTE3MjY1NX0.TOv9OOFxRrcBXUPbFqGCtsTUWVNryUM8dGdhIBIyY-M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      // Add your table types here
    }
  }
} 