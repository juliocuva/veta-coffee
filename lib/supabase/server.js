import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
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

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}
