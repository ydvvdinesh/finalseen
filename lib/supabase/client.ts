import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing. Using mock client.")
    return createMockClient()
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Create a mock client that doesn't throw errors when methods are called
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      setSession: () => Promise.resolve({ data: { session: null }, error: null }),
      refreshSession: () => Promise.resolve({ data: { session: null }, error: null }),
      verifyOtp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: "Auth not configured" } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Auth not configured" } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: "Auth not configured" } }),
      signOut: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: { message: "Auth not configured" } }),
      resetPasswordForEmail: () => Promise.resolve({ error: { message: "Auth not configured" } }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: { message: "Database not configured" } }),
      select: () => Promise.resolve({ data: [], error: null }),
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: "" }, error: { message: "Storage not configured" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" }, error: null }),
      }),
    },

  }
}
