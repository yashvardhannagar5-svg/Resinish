import { create } from 'zustand'
import { NOT_CONFIGURED_MESSAGE, supabase } from '../lib/supabase'

/** Auth state backed by Supabase Auth. Call initAuth() once at startup. */
export const useAuthStore = create(() => ({
  user: null,
  ready: !supabase, // with no Supabase client there is nothing to wait for
}))

export async function signIn(email, password) {
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error ? { error: error.message } : {}
}

export async function signUp(email, password) {
  if (!supabase) return { error: NOT_CONFIGURED_MESSAGE }
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }
  // With email confirmation switched on, no session is returned until the link is clicked.
  return { needsConfirmation: !data.session }
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

let started = false
export function initAuth() {
  if (started || !supabase) return
  started = true
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({ user: data.session?.user ?? null, ready: true })
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({ user: session?.user ?? null, ready: true })
  })
}
