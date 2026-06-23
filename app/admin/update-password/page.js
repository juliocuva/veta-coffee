'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Mínimo 6 caracteres" 
                        required 
                        disabled={loading}
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        )}
                      </button>
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
