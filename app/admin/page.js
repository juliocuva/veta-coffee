'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Status & local storage fields
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedSlug, setSavedSlug] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // 1. Try to read credentials from URL query parameters
    const params = new URLSearchParams(window.location.search)
    const urlEmail = params.get('email')
    const urlPass = params.get('pass')

    if (urlEmail && urlPass) {
      setEmail(urlEmail)
      setPassword(urlPass)
      
      const performAutoLogin = async () => {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithPassword({ email: urlEmail, password: urlPass })
        if (!error) {
          localStorage.setItem('veta_saved_email', urlEmail)
          localStorage.setItem('veta_saved_password', urlPass)
          
          // Fetch slug to save it
          const { data: userRecord } = await supabase.auth.getUser()
          if (userRecord?.user) {
            const { data: roaster } = await supabase
              .from('roasters')
              .select('slug')
              .eq('user_id', userRecord.user.id)
              .single()
            if (roaster?.slug) {
              localStorage.setItem('veta_saved_slug', roaster.slug)
              setSavedSlug(roaster.slug)
            }
          }

          router.push('/admin/dashboard')
        } else {
          setError('❌ Acceso automático fallido. Verifica tus credenciales de la URL.')
          setLoading(false)
        }
      }
      performAutoLogin()
      return
    }

    // 2. Fallback: Autofill from local storage
    const savedEmail = localStorage.getItem('veta_saved_email')
    const savedPassword = localStorage.getItem('veta_saved_password')
    const slug = localStorage.getItem('veta_saved_slug')
    
    if (savedEmail) setEmail(savedEmail)
    if (savedPassword) setPassword(savedPassword)
    if (slug) setSavedSlug(slug)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError('❌ Correo electrónico o código de acceso incorrectos')
      setLoading(false)
    } else {
      // Save credentials for fast access next time
      localStorage.setItem('veta_saved_email', email)
      localStorage.setItem('veta_saved_password', password)

      // Fetch roaster slug to save it on login
      const user = authData?.user
      if (user) {
        const { data: roaster } = await supabase
          .from('roasters')
          .select('slug')
          .eq('user_id', user.id)
          .single()
        if (roaster?.slug) {
          localStorage.setItem('veta_saved_slug', roaster.slug)
          setSavedSlug(roaster.slug)
        }
      }

      router.push('/admin/dashboard')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('❌ Todos los campos son obligatorios')
      setLoading(false)
      return
    }

    // Generate unique slug
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")

    if (!slug) {
      setError('❌ El nombre de la empresa no es válido')
      setLoading(false)
      return
    }

    // 1. Sign up user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(`❌ Error al registrar usuario: ${signUpError.message}`)
      setLoading(false)
      return
    }

    const user = authData?.user
    if (!user) {
      setError('❌ No se pudo crear el usuario')
      setLoading(false)
      return
    }

    // 2. Insert into roasters table
    const { error: roasterError } = await supabase
      .from('roasters')
      .insert({
        slug,
        name,
        phone,
        user_id: user.id
      })

    if (roasterError) {
      setError(`❌ Error al guardar datos de la empresa: ${roasterError.message}`)
      setLoading(false)
      return
    }

    // 3. Auto Sign In
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(`❌ Registro exitoso, pero falló el ingreso automático: ${signInError.message}`)
      setLoading(false)
      return
    }

    localStorage.setItem('veta_saved_email', email)
    localStorage.setItem('veta_saved_password', password)
    localStorage.setItem('veta_saved_slug', slug)
    setSavedSlug(slug)

    // Clear inputs
    setName('')
    setPhone('')
    setEmail('')
    setPassword('')
    setLoading(false)

    router.push('/admin/dashboard')
  }

  const handleCopyStoreLink = () => {
    const origin = window.location.origin
    const storeUrl = `${origin}/${savedSlug}`
    navigator.clipboard.writeText(storeUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="app-shell" style={{ alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', minHeight: '100dvh', overflowY: 'auto' }}>
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,97,60,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '0.02em', marginBottom: '0.2rem' }}>
            <span style={{ fontWeight: 400 }}>be</span>
            <span style={{ fontWeight: 900 }}>COFFEE</span>
            <span style={{ fontWeight: 400, color: 'var(--gold)' }}>.pro</span>
          </h1>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Acceso Tostadores</p>
        </div>

        {/* Tab triggers */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--r-md)',
          padding: '0.25rem',
          width: '100%',
          gap: '0.25rem'
        }}>
          <button 
            onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              background: tab === 'login' ? 'linear-gradient(135deg, var(--green), #00804E)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              padding: '0.6rem',
              color: tab === 'login' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--t)',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Ingresar
          </button>
          <button 
            onClick={() => { setTab('register'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              background: tab === 'register' ? 'linear-gradient(135deg, var(--green), #00804E)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--r-sm)',
              padding: '0.6rem',
              color: tab === 'register' ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--t)',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            Registrarse
          </button>
        </div>

        {error && <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#FF6B6B', textAlign: 'center', width: '100%', padding: '0 0.5rem' }}>{error}</p>}
        {successMsg && <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#25D366', textAlign: 'center', width: '100%', padding: '0 0.5rem', lineHeight: 1.4 }}>{successMsg}</p>}

        {tab === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="field">
              <label>Correo electrónico</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tostador@ejemplo.com" required />
              </div>
            </div>
            
            <div className="field">
              <label>Código de acceso (Contraseña)</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Verificando...' : 'Ingresar al Panel'}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="field">
              <label>Nombre de la Empresa (Tostador)</label>
              <div className="field-icon-wrap">
                <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>🏢</span>
                <input style={{ paddingLeft: '2.6rem' }} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Sagrado Corazón" required />
              </div>
            </div>

            <div className="field">
              <label>Número de WhatsApp (Celular)</label>
              <div className="field-icon-wrap">
                <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' }}>💬</span>
                <input style={{ paddingLeft: '2.6rem' }} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 573123456789" required />
              </div>
            </div>

            <div className="field">
              <label>Correo electrónico</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
              </div>
            </div>
            
            <div className="field">
              <label>Código de acceso (Contraseña)</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Registrando...' : 'Registrar Cuenta'}
            </button>
          </form>
        )}

        {savedSlug && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
            <button 
              onClick={handleCopyStoreLink} 
              style={{ 
                background: 'linear-gradient(135deg, rgba(211, 178, 127, 0.15) 0%, rgba(211, 178, 127, 0.05) 100%)', 
                border: '1px solid var(--gold)', 
                borderRadius: 'var(--r-md)',
                padding: '0.9rem 1.2rem',
                fontFamily: 'Montserrat, sans-serif', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: 'var(--gold)', 
                cursor: 'pointer', 
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'var(--t)',
                boxShadow: '0 4px 20px rgba(211, 178, 127, 0.12)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(211, 178, 127, 0.25) 0%, rgba(211, 178, 127, 0.15) 100%)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(211, 178, 127, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(211, 178, 127, 0.15) 0%, rgba(211, 178, 127, 0.05) 100%)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(211, 178, 127, 0.12)';
              }}
            >
              {linkCopied ? '¡Enlace Copiado! ✅' : '🔗 Copiar Link de mi Tienda'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
