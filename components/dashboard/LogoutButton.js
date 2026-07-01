'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  return (
    <button onClick={handleLogout} className="btn-primary" style={{ marginTop: '1rem', background: '#D94169' }}>
      Cerrar Sesión y Volver
    </button>
  )
}
