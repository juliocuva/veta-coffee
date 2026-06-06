'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const VARIETIES = ['Castillo', 'Caturra', 'Colombia', 'Bourbon', 'Tabi', 'Geisha', 'Bourbon Rosado', 'Pacamara', 'Typica', 'Sidra']
const PROCESSES = ['Lavado', 'Honey', 'Natural']

const handlePriceInputChange = (e) => {
  const input = e.target
  let value = input.value
  const clean = value.replace(/\D/g, '')
  const formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  input.value = formatted
}

const parseFormattedPrice = (val) => {
  if (!val) return 0
  return parseInt(val.toString().replace(/\D/g, '')) || 0
}

const formatRoastDate = (dateStr) => {
  if (!dateStr) return ''
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return dateStr
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${match[3]} ${monthNames[parseInt(match[2], 10) - 1]} ${match[1]}`
}

export default function DashboardClient({ initialRoaster, initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isOffer, setIsOffer] = useState(false)
  
  // Custom dropdown states for ADD Modal
  const [addVariety, setAddVariety] = useState('')
  const [addVarietyCustom, setAddVarietyCustom] = useState('')
  const [addProcess, setAddProcess] = useState('')
  const [addProcessCustom, setAddProcessCustom] = useState('')

  // Custom dropdown states for EDIT Modal
  const [editVariety, setEditVariety] = useState('')
  const [editVarietyCustom, setEditVarietyCustom] = useState('')
  const [editProcess, setEditProcess] = useState('')
  const [editProcessCustom, setEditProcessCustom] = useState('')

  // Edit states
  const [editingProduct, setEditingProduct] = useState(null)
  const [editIsOffer, setEditIsOffer] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Profile Edit states
  const [roaster, setRoaster] = useState(initialRoaster)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [profileName, setProfileName] = useState(initialRoaster.name)
  const [profilePhone, setProfilePhone] = useState(initialRoaster.phone)
  const [profileSlug, setProfileSlug] = useState(initialRoaster.slug)
  const [profileEmail, setProfileEmail] = useState('')
  const [profilePassword, setProfilePassword] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Theme Sync
  useEffect(() => {
    const saved = localStorage.getItem('veta_theme') || 'light'
    if (saved === 'dark') {
      document.body.classList.add('dark-theme')
      setIsDark(true)
    } else {
      document.body.classList.remove('dark-theme')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('veta_theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('veta_theme', 'light')
    }
  }

  useEffect(() => {
    const loadEmail = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.email) {
        setProfileEmail(data.user.email)
      }
    }
    loadEmail()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
          } else if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new])
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    if (roaster?.slug) {
      localStorage.setItem('veta_saved_slug', roaster.slug)
    }
  }, [roaster])

  const handleCopyLink = () => {
    const origin = window.location.origin
    const storeUrl = `${origin}/${roaster.slug}`
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta variedad?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleStartEdit = (product) => {
    setEditingProduct(product)
    setEditIsOffer(product.is_offer || false)

    if (VARIETIES.includes(product.variety)) {
      setEditVariety(product.variety)
      setEditVarietyCustom('')
    } else {
      setEditVariety('Otro')
      setEditVarietyCustom(product.variety)
    }

    if (PROCESSES.includes(product.process)) {
      setEditProcess(product.process)
      setEditProcessCustom('')
    } else {
      setEditProcess('Otro')
      setEditProcessCustom(product.process)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!profileName.trim() || !profilePhone.trim() || !profileSlug.trim() || !profileEmail.trim()) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }

    setSavingProfile(true)

    // 1. Update email if changed
    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user && profileEmail.trim() !== userData.user.email) {
      const { error: emailErr } = await supabase.auth.updateUser({ email: profileEmail.trim() })
      if (emailErr) {
        alert('Error al actualizar correo electrónico: ' + emailErr.message)
        setSavingProfile(false)
        return
      }
    }

    // 2. Update password if provided
    if (profilePassword.trim()) {
      if (profilePassword.trim().length < 6) {
        alert('La contraseña debe tener mínimo 6 caracteres.')
        setSavingProfile(false)
        return
      }
      const { error: passErr } = await supabase.auth.updateUser({ password: profilePassword.trim() })
      if (passErr) {
        alert('Error al actualizar contraseña: ' + passErr.message)
        setSavingProfile(false)
        return
      }
    }

    // 3. Update Roaster profile table (name, phone, slug)
    const cleanSlug = profileSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")

    const { data, error } = await supabase
      .from('roasters')
      .update({ 
        name: profileName.trim(), 
        phone: profilePhone.trim(),
        slug: cleanSlug
      })
      .eq('id', roaster.id)
      .select()
      .single()

    if (!error && data) {
      setRoaster(data)
      setProfileSlug(data.slug)
      localStorage.setItem('veta_saved_slug', data.slug)
      setProfileModalOpen(false)
      setProfilePassword('')
      alert('¡Perfil y datos de registro actualizados con éxito! 🎉')
    } else {
      alert('Error al actualizar datos de la empresa: ' + (error?.message || 'Error desconocido'))
    }
    setSavingProfile(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()

    const varValue = addVariety === 'Otro' ? addVarietyCustom.trim() : addVariety
    const prValue = addProcess === 'Otro' ? addProcessCustom.trim() : addProcess

    if (!varValue) {
      alert('Por favor selecciona o especifica una variedad.')
      return
    }
    if (!prValue) {
      alert('Por favor selecciona o especifica un proceso.')
      return
    }

    setSaving(true)
    const fd = new FormData(e.target)
    const newProduct = {
      roaster_id: roaster.id,
      name: fd.get('name'),
      lot: fd.get('lot'),
      roast_date: fd.get('roastDate') || null,
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: fd.get('altitude') + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseFormattedPrice(fd.get('price250')),
      price_500: parseFormattedPrice(fd.get('price500')),
      price_2500: parseFormattedPrice(fd.get('price2500')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 20),
      is_offer: isOffer,
      offer_discount: isOffer ? parseInt(fd.get('discount') || 0) / 100 : 0
    }

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single()

    if (!error && data) {
      setProducts([...products, data])
      setModalOpen(false)
      e.target.reset()
      setIsOffer(false)
      setAddVariety('')
      setAddVarietyCustom('')
      setAddProcess('')
      setAddProcessCustom('')
    }
    setSaving(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const varValue = editVariety === 'Otro' ? editVarietyCustom.trim() : editVariety
    const prValue = editProcess === 'Otro' ? editProcessCustom.trim() : editProcess

    if (!varValue) {
      alert('Por favor selecciona o especifica una variedad.')
      return
    }
    if (!prValue) {
      alert('Por favor selecciona o especifica un proceso.')
      return
    }

    setSaving(true)
    const fd = new FormData(e.target)
    
    // Extract numbers safely
    const cleanAltitude = fd.get('altitude').replace(' msnm', '')

    const updatedProduct = {
      name: fd.get('name'),
      lot: fd.get('lot'),
      roast_date: fd.get('roastDate') || null,
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: cleanAltitude + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseFormattedPrice(fd.get('price250')),
      price_500: parseFormattedPrice(fd.get('price500')),
      price_2500: parseFormattedPrice(fd.get('price2500')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 0),
      is_offer: editIsOffer,
      offer_discount: editIsOffer ? parseInt(fd.get('discount') || 0) / 100 : 0
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', editingProduct.id)
      .select()
      .single()

    if (!error && data) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p))
      setEditingProduct(null)
    }
    setSaving(false)
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <header style={{
        padding: '1.1rem 1.2rem 0.95rem', 
        background: '#092e1c',
        borderBottom: '1px solid rgba(110, 207, 151, 0.15)', 
        flexShrink: 0,
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-montserrat), sans-serif', 
            fontSize: '1rem', 
            fontWeight: 800, 
            color: '#6FCF97', 
            letterSpacing: '0.04em',
            margin: 0
          }}>
            Panel de {roaster.name}
          </h1>
          <button 
            onClick={toggleTheme} 
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', cursor: 'pointer',
              transition: 'var(--t)',
            }}
            title="Cambiar tema"
          >
            {isDark ? (
              <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414L13.293 6.7a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 9a1 1 0 000 2h1a1 1 0 100-2h-1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-2.293a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 10a1 1 0 00-2 0v1a1 1 0 100 2h1a1 1 0 100-2H4zm.293-4.293a1 1 0 00-1.414 0L2.172 6.42a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          flexWrap: 'wrap',
          gap: '0.5rem' 
        }}>
          {/* Left Side: Catalog and Store Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <a 
              href={`/${roaster.slug}`} 
              target="_blank" 
              style={{ 
                fontSize: '0.55rem', 
                fontWeight: 700,
                color: '#6FCF97', 
                textDecoration: 'none',
                border: '1px solid rgba(110, 207, 151, 0.4)',
                borderRadius: 6,
                padding: '0.25rem 0.55rem',
                background: 'rgba(110, 207, 151, 0.05)',
                transition: 'var(--t)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                height: '24px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.05)'}
            >
              Ver Catálogo ↗
            </a>
            <button 
              onClick={handleCopyLink} 
              style={{
                background: 'rgba(110, 207, 151, 0.05)',
                border: '1px solid rgba(110, 207, 151, 0.4)',
                borderRadius: 6,
                padding: '0.25rem 0.55rem',
                fontSize: '0.55rem',
                fontWeight: 700,
                color: '#6FCF97',
                cursor: 'pointer',
                transition: 'var(--t)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                height: '24px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.05)'}
            >
              {copied ? '¡Copiado! ✅' : 'Link de mi tienda'}
            </button>
          </div>

          {/* Right Side: Edit User and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              onClick={() => {
                setProfileName(roaster.name)
                setProfilePhone(roaster.phone)
                setProfileSlug(roaster.slug)
                setProfileModalOpen(true)
              }} 
              style={{
                background: 'rgba(110, 207, 151, 0.05)', 
                border: '1px solid rgba(110, 207, 151, 0.4)', 
                cursor: 'pointer', 
                fontSize: '0.55rem', 
                fontWeight: 700,
                color: '#6FCF97',
                padding: '0.25rem 0.55rem', 
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'var(--t)',
                height: '24px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.05)'}
              title="Editar Perfil / Datos"
            >
              Editar Usuario
            </button>
            <button 
              onClick={handleLogout} 
              style={{
                background: 'rgba(110, 207, 151, 0.05)', 
                border: '1px solid rgba(110, 207, 151, 0.4)', 
                borderRadius: 6,
                fontSize: '0.55rem', 
                fontWeight: 700, 
                color: '#6FCF97', 
                padding: '0.25rem 0.6rem',
                cursor: 'pointer', 
                textTransform: 'uppercase',
                height: '24px',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'var(--t)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(110, 207, 151, 0.05)'}
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="scroll-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>Mis Variedades</h2>
          {!isPreviewMode && (
            <button onClick={() => setModalOpen(true)} style={{
              background: 'var(--green)', color: '#fff', border: 'none', width: 32, height: 32,
              borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>+</button>
          )}
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No tienes variedades registradas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map(p => {
              const base = p.price_250
              const displayPrice = p.is_offer ? Math.round(base * (1 - p.offer_discount)) : base
              const formatPrice = (val) => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

              return (
                <div key={p.id} style={{
                  background: 'var(--bg-card-2)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--r-lg)', 
                  padding: '0.65rem 0.85rem', 
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(80, 37, 20, 0.02)'
                }}>
                  {/* Admin edit/delete buttons top right */}
                  <div style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', display: 'flex', gap: '0.4rem', zIndex: 10 }}>
                    <button onClick={() => handleStartEdit(p)} style={{
                      background: 'rgba(211,178,127,0.15)', border: '1px solid rgba(211,178,127,0.3)',
                      color: 'var(--gold)', width: 24, height: 24, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} title="Editar">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.829z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(p.id)} style={{
                      background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)',
                      color: '#E74C3C', width: 24, height: 24, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem'
                    }}>×</button>
                  </div>
 
                  {/* Card Top: Variety and Grower/Lot Title Hierarchy */}
                  <div style={{ marginBottom: '0.1rem', paddingRight: '3.8rem' }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.01em', lineHeight: 1.25 }}>
                      {p.variety}
                    </h3>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, margin: '0.05rem 0 0.25rem 0' }}>
                      {p.name} {p.lot ? `· ${p.lot}` : ''} {p.roast_date ? `· Tostión: ${formatRoastDate(p.roast_date)}` : ''}
                    </p>
                  </div>
 
                  {/* Row 2: Metadata tags (Region, Process, Altitude) */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <span className="tag tag-region">
                      {p.region}
                    </span>
                    <span className="tag tag-default">
                      {p.process}
                    </span>
                    <span className="tag tag-default">
                      {p.altitude}
                    </span>
                    {p.is_offer && (
                      <span className="tag tag-offer">
                        −{Math.round(p.offer_discount * 100)}% oferta
                      </span>
                    )}
                  </div>
 
                  {/* Tasting notes */}
                  <p style={{ 
                    fontSize: '0.61rem', 
                    color: 'var(--text-muted)', 
                    letterSpacing: '0.01em',
                    margin: '0.15rem 0 0.4rem 0'
                  }}>
                    {p.notes}
                  </p>
 
                  {/* Divider and bottom section */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '0.45rem',
                    borderTop: '1px solid var(--glass-border)',
                  }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: 'var(--text-muted)' 
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                        background: p.inventory_kg <= 2 ? 'var(--danger)' : p.inventory_kg <= 8 ? 'var(--gold)' : 'var(--green)',
                      }} />
                      {p.inventory_kg <= 2 ? 'AGOTADO' : p.inventory_kg <= 8 ? `SOLO ${p.inventory_kg}KG` : `${p.inventory_kg}KG DISPONIBLE`}
                    </div>
                    
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '0.15rem', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.48rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>desde</span>
                      <div style={{ fontSize: '1.18rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                        {formatPrice(displayPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal Add */}
      {modalOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200, background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)', padding: '0.6rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.1rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Nueva Variedad</h2>
              <button onClick={() => setModalOpen(false)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="field"><label>Caficultor</label><input name="name" required placeholder="Ej: Julio Cuva" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Finca/Lote</label><input name="lot" required placeholder="Ej: La Esperanza" /></div>
                <div className="field"><label>Fecha de Tostión</label><input name="roastDate" type="date" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Variedad</label>
                  <select value={addVariety} onChange={e => setAddVariety(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {addVariety === 'Otro' && (
                    <input 
                      type="text" 
                      value={addVarietyCustom} 
                      onChange={e => setAddVarietyCustom(e.target.value)} 
                      placeholder="Especificar variedad" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
                <div className="field">
                  <label>Proceso</label>
                  <select value={addProcess} onChange={e => setAddProcess(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {addProcess === 'Otro' && (
                    <input 
                      type="text" 
                      value={addProcessCustom} 
                      onChange={e => setAddProcessCustom(e.target.value)} 
                      placeholder="Especificar proceso" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Región</label><input name="region" required /></div>
                <div className="field"><label>Altura (msnm)</label><input name="altitude" type="number" required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Precio 250g</label><input name="price250" type="text" inputMode="numeric" onChange={handlePriceInputChange} required /></div>
                <div className="field"><label>Precio 500g</label><input name="price500" type="text" inputMode="numeric" onChange={handlePriceInputChange} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Precio 2.5kg</label><input name="price2500" type="text" inputMode="numeric" onChange={handlePriceInputChange} required /></div>
                <div className="field"><label>Cantidad Disponible (kg)</label><input name="inventoryKg" type="number" step="0.1" required placeholder="Ej: 25" /></div>
              </div>
              <div className="field"><label>Notas de cata</label><textarea name="notes" rows={3} placeholder="Durazno, Panela..." /></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                <input type="checkbox" checked={isOffer} onChange={e => setIsOffer(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--green)' }} />
                <label style={{ fontSize: '0.8rem' }}>Marcar en oferta</label>
              </div>
              
              {isOffer && (
                <div className="field"><label>Descuento (%)</label><input name="discount" type="number" min="1" max="100" defaultValue="10" /></div>
              )}

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                {saving ? 'Guardando...' : 'Guardar Variedad'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {editingProduct && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200, background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)', padding: '0.6rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.1rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Variedad</h2>
              <button onClick={() => setEditingProduct(null)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="field">
                <label>Caficultor</label>
                <input name="name" required defaultValue={editingProduct.name} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Finca/Lote</label>
                  <input name="lot" required defaultValue={editingProduct.lot} />
                </div>
                <div className="field">
                  <label>Fecha de Tostión</label>
                  <input name="roastDate" type="date" defaultValue={editingProduct.roast_date || ''} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Variedad</label>
                  <select value={editVariety} onChange={e => setEditVariety(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {editVariety === 'Otro' && (
                    <input 
                      type="text" 
                      value={editVarietyCustom} 
                      onChange={e => setEditVarietyCustom(e.target.value)} 
                      placeholder="Especificar variedad" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
                <div className="field">
                  <label>Proceso</label>
                  <select value={editProcess} onChange={e => setEditProcess(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {editProcess === 'Otro' && (
                    <input 
                      type="text" 
                      value={editProcessCustom} 
                      onChange={e => setEditProcessCustom(e.target.value)} 
                      placeholder="Especificar proceso" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Región</label>
                  <input name="region" required defaultValue={editingProduct.region} />
                </div>
                <div className="field">
                  <label>Altura (msnm)</label>
                  <input name="altitude" required defaultValue={editingProduct.altitude.replace(' msnm', '')} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 250g</label>
                  <input name="price250" type="text" inputMode="numeric" onChange={handlePriceInputChange} required defaultValue={editingProduct.price_250 ? editingProduct.price_250.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
                <div className="field">
                  <label>Precio 500g</label>
                  <input name="price500" type="text" inputMode="numeric" onChange={handlePriceInputChange} required defaultValue={editingProduct.price_500 ? editingProduct.price_500.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 2.5kg</label>
                  <input name="price2500" type="text" inputMode="numeric" onChange={handlePriceInputChange} required defaultValue={editingProduct.price_2500 ? editingProduct.price_2500.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
                <div className="field">
                  <label>Cantidad Disponible (kg)</label>
                  <input name="inventoryKg" type="number" step="0.1" required defaultValue={editingProduct.inventory_kg} />
                </div>
              </div>
              <div className="field">
                <label>Notas de cata</label>
                <textarea name="notes" rows={3} defaultValue={editingProduct.notes} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                <input type="checkbox" checked={editIsOffer} onChange={e => setEditIsOffer(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--green)' }} />
                <label style={{ fontSize: '0.8rem' }}>Marcar en oferta</label>
              </div>
              
              {editIsOffer && (
                <div className="field">
                  <label>Descuento (%)</label>
                  <input name="discount" type="number" min="1" max="100" defaultValue={Math.round((editingProduct.offer_discount || 0.1) * 100)} />
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                {saving ? 'Guardando Cambios...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Profile Edit */}
      {profileModalOpen && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200, background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)', padding: '0.6rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.1rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Registro</h2>
              <button onClick={() => setProfileModalOpen(false)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="field">
                <label>Nombre de la Empresa (Tostador)</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={e => setProfileName(e.target.value)} 
                  required 
                />
              </div>

              <div className="field">
                <label>Identificador del Link (Slug / URL)</label>
                <input 
                  type="text" 
                  value={profileSlug} 
                  onChange={e => setProfileSlug(e.target.value)} 
                  required 
                />
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  Su link cambiará a: vetacoffee.vercel.app/<strong>{profileSlug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")}</strong>
                </span>
              </div>

              <div className="field">
                <label>Número de WhatsApp</label>
                <input 
                  type="tel" 
                  value={profilePhone} 
                  onChange={e => setProfilePhone(e.target.value)} 
                  placeholder="Ej: 573123456789"
                  required 
                />
              </div>

              <div className="field">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={profileEmail} 
                  onChange={e => setProfileEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="field">
                <label>Nueva Contraseña (Dejar en blanco para mantener actual)</label>
                <input 
                  type="password" 
                  value={profilePassword} 
                  onChange={e => setProfilePassword(e.target.value)} 
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={savingProfile} style={{ marginTop: '0.5rem' }}>
                {savingProfile ? 'Guardando Datos...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
