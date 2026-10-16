import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// The anon key is designed to be public; Row Level Security (see supabase/schema.sql) protects the data.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

export const NOT_CONFIGURED_MESSAGE =
  'The store database isn’t connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
