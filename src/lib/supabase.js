import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// A bad URL or key must never crash the whole site, so setup errors are caught and logged.
let client = null
if (url && anonKey) {
  try {
    client = createClient(url, anonKey)
  } catch (error) {
    console.error('Supabase setup failed. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.', error)
  }
}

export const supabase = client
export const isSupabaseConfigured = Boolean(client)

export const NOT_CONFIGURED_MESSAGE =
  'The store database isn’t connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
