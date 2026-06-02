import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch all active roasters
  const { data: roasters } = await supabase
    .from('roasters')
    .select('slug, name, description')
    .order('created_at', { ascending: true })

  // If only one roaster, redirect directly to their catalog
  if (roasters?.length === 1) {
    redirect(`/${roasters[0].slug}`)
  }

  // Multi-roaster landing
  return (
    <div className="app-shell">
      <header style={{
        padding: '1.5rem 1.2rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--gold)' }}>
          VETA PLATFORM
        </h1>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>
          Café de especialidad colombiano
        </p>
      </header>

      <div className="scroll-area" style={{ padding: '1.2rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Elige tu tostador
        </p>
        {roasters?.map((r) => (
          <a key={r.slug} href={`/${r.slug}`} style={{
            display: 'block',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--r-lg)',
            padding: '1.1rem',
            marginBottom: '0.75rem',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'var(--t)',
          }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</p>
            {r.description && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{r.description}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
