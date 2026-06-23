'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'


export default function AdminLogin() {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Status & local storage fields
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedSlug, setSavedSlug] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  // PWA Install
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // ── PWA Setup ──────────────────────────────────────────
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .catch((err) => console.warn('SW registration failed:', err))
    }

    // Detectar si ya está instalada como app
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Detectar iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(ios)

    // Capturar el evento de instalación (Chrome/Android/Edge)
    const handleInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    // ── Auth Check ─────────────────────────────────────────
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/admin/dashboard')
      }
    }
    checkSession()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }

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

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    
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

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    if (!email.trim()) {
      setError('❌ Ingresa tu correo electrónico para recuperar la contraseña')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/update-password`,
    })

    if (error) {
      setError(`❌ Error: ${error.message}`)
    } else {
      setSuccessMsg('✅ Revisa tu correo electrónico para restablecer tu contraseña.')
    }
    setLoading(false)
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
      email: email.trim(),
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
  const handleInstallClick = async () => {
    if (installPrompt) {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === 'accepted') setInstallPrompt(null)
    }
  }

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '8.5rem 1.5rem 2rem', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {/* Back to Landing Page / Home Icon */}
      <Link href="/" style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--green-dim)',
        border: '1px solid rgba(0, 92, 56, 0.2)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        color: 'var(--green)',
        cursor: 'pointer',
        transition: 'var(--t)',
        textDecoration: 'none',
        zIndex: 10
      }} 
      title="Volver al Inicio"
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--green-glow)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--green-dim)'}
      >
        <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>





      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,97,60,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Header — logo de la plataforma */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <img src="/becoffee-logo.svg" alt="beCOFFEE.pro" style={{ height: '162px', width: 'auto', objectFit: 'contain' }} />
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
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: '2.5rem' }} />
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

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Verificando...' : 'Ingresar al Panel'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
              <button type="button" onClick={() => { setTab('forgot_password'); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        ) : tab === 'forgot_password' ? (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPassword} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '0.5rem' }}>
              Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu cuenta.
            </p>
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
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
              <button type="button" onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                Volver a Ingresar
              </button>
            </div>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="field">
              <label>Nombre de la Empresa (Tostador)</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Sagrado Corazón" required />
              </div>
            </div>

            <div className="field">
              <label>Número de WhatsApp (Celular)</label>
              <div className="field-icon-wrap">
                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ej: 573123456789" required />
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
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required style={{ paddingRight: '2.5rem' }} />
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

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Registrando...' : 'Registrar Cuenta'}
            </button>
          </form>
        )}

      {/* ── PWA Install Banner ──────────────────────────────── */}
      {!isStandalone && (installPrompt || isIOS) && (
        <button
          onClick={installPrompt ? handleInstallClick : () => setShowIOSHint(h => !h)}
          style={{
            width: '100%',
            marginTop: '0.5rem',
            background: 'transparent',
            border: 'none',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'var(--t)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {installPrompt 
              ? 'Instalar App para acceso rápido' 
              : (showIOSHint ? 'Toca Compartir → Añadir a inicio' : 'Instalar en iPhone')}
          </span>
        </button>
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
              {linkCopied ? (
                <span>¡Enlace Copiado! ✅</span>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <span>Copiar Link de mi Tienda</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Powered by AxisONE Coffee */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        fontSize: '0.56rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        marginTop: 'auto',
        opacity: 0.8,
        position: 'relative',
        zIndex: 1
      }}>
        <span>Powered by AxisONE Coffee</span>
        <img 
          src="/logo-axisone.png" 
          alt="AxisONE Coffee" 
          style={{ 
            height: '42px', 
            width: 'auto', 
            objectFit: 'contain',
            filter: 'brightness(0) opacity(0.5)'
          }} 
        />
      </div>
    </div>
  )
}
