import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return {
      from: () => ({
        select: () => ({
          eq: () => ({ 
            order: () => ({ 
              single: () => Promise.resolve({ data: null, error: null }) 
            }) 
          }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve(),
      }
    }
  }

  return createBrowserClient(url, key)
}
