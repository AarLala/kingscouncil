import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edbzcwrxfhgudxaklovz.supabase.co'; // TODO: Replace with your Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYnpjd3J4ZmhndWR4YWtsb3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTY2NTUsImV4cCI6MjA2MTE3MjY1NX0.TOv9OOFxRrcBXUPbFqGCtsTUWVNryUM8dGdhIBIyY-M'; // TODO: Replace with your Supabase anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 