import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export const metadata = { title: 'Dashboard — beCOFFEE.pro' }

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin')

  // Get roaster profile for this user
  const { data: roaster } = await supabase
    .from('roasters')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!roaster) {
    return (
      <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h2>Perfil no encontrado</h2>
        <p style={{ color: 'var(--text-muted)' }}>No tienes un perfil de tostador asociado a esta cuenta.</p>
      </div>
    )
  }

  // Get products for this roaster
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('roaster_id', roaster.id)
    .order('created_at', { ascending: true })

  return <DashboardClient initialRoaster={roaster} initialProducts={products || []} />
}
