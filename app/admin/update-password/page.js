'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle PKCE code exchange or hash fragment session
    const checkSession = async () => {
      // 1. Check if there's a code in the URL (PKCE flow)
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setError(`❌ Error al verificar el código: ${error.message}`)
          setCheckingSession(false)
          return
        }
        // Remove code from URL so it doesn't get used again
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      // 2. Fallback: check if session was established via hash fragment or cookies
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('❌ El enlace de recuperación es inválido o ha expirado. Por favor, solicita uno nuevo desde la pantalla de ingreso.')
      }
      setCheckingSession(false)
    }
    
    checkSession()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    if (password.length < 6) {
      setError('❌ La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(`❌ Error al actualizar: ${updateError.message}`)
      setLoading(false)
    } else {
      setSuccessMsg('✅ Contraseña actualizada correctamente. Redirigiendo al panel...')
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Header — logo de la plataforma */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <img src="/becoffee-logo.svg" alt="beCOFFEE.pro" style={{ height: '162px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--r-md)',
          padding: '2rem 1.5rem',
          boxShadow: '0 8px 32px var(--shadow-color)'
        }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '1.5rem' }}>Restablecer Contraseña</h2>
          
          {checkingSession ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Verificando enlace...</p>
          ) : (
            <>
              {error && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', textAlign: 'center', marginBottom: '1rem', lineHeight: 1.4 }}>{error}</p>}
              {successMsg && <p style={{ fontSize: '0.8rem', color: 'var(--success)', textAlign: 'center', marginBottom: '1rem', lineHeight: 1.4 }}>{successMsg}</p>}

              {!error && !successMsg && (
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.5rem' }}>
                    Ingresa tu nueva contraseña para acceder al sistema.
                  </p>
                  <div className="field">
                    <label>Nueva contraseña</label>
                    <div className="field-icon-wrap">
                      <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Mínimo 6 caracteres" 
                        required 
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
                    {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
                  </button>
                </form>
              )}
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
