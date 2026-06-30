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
  
  // Image upload states
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  
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
  const [profileDescription, setProfileDescription] = useState(initialRoaster.description || '')
  const [profileSlug, setProfileSlug] = useState(initialRoaster.slug)
  const [profileEmail, setProfileEmail] = useState('')
  const [profileLogoUrl, setProfileLogoUrl] = useState(initialRoaster.logo_url || '')
  const [profileLogoFile, setProfileLogoFile] = useState(null)
  const [profilePassword, setProfilePassword] = useState('')
  const [showProfilePassword, setShowProfilePassword] = useState(false)
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
    setEditImagePreview(product.image_url || null)
    setEditImageFile(null)

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

    // 3. Upload Logo if present
    let updatedLogoUrl = profileLogoUrl
    if (profileLogoFile) {
      const fileExt = profileLogoFile.name.split('.').pop()
      const fileName = `logo-${roaster.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, profileLogoFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        updatedLogoUrl = publicUrl
      }
    }

    // 4. Update Roaster profile table (name, phone, slug, logo)
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
        slug: cleanSlug,
        description: profileDescription.trim(),
        logo_url: updatedLogoUrl
      })
      .eq('id', roaster.id)
      .select()
      .single()

    if (!error && data) {
      setRoaster(data)
      setProfileSlug(data.slug)
      setProfileDescription(data.description || '')
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

    let imageUrl = null
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      } else {
        console.error('Error uploading image:', uploadError)
      }
    }

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
      price_340: parseFormattedPrice(fd.get('price340')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 20),
      is_offer: isOffer,
      offer_discount: isOffer ? parseInt(fd.get('discount') || 0) / 100 : 0,
      image_url: imageUrl
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
      setImageFile(null)
      setImagePreview(null)
    } else if (error) {
      alert('Error al guardar el producto: ' + error.message)
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
    
    let imageUrl = editingProduct.image_url
    if (editImageFile) {
      const fileExt = editImageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, editImageFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      } else {
        console.error('Error uploading image:', uploadError)
      }
    }

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
      price_340: parseFormattedPrice(fd.get('price340')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 0),
      is_offer: editIsOffer,
      offer_discount: editIsOffer ? parseInt(fd.get('discount') || 0) / 100 : 0,
      image_url: imageUrl
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
      setEditImageFile(null)
      setEditImagePreview(null)
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
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          {roaster.logo_url ? (
            <img 
              src={roaster.logo_url} 
              alt={roaster.name} 
              style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} 
            />
          ) : (
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
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
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
              <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          
          {/* Right Side: Link, Edit User, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleCopyLink} 
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6FCF97'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              {copied ? (
                <>✅ ¡Copiado!</>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                  </svg>
                  Link Catálogo
                </>
              )}
            </button>
            <button 
              onClick={() => {
                setProfileName(roaster.name)
                setProfilePhone(roaster.phone)
                setProfileSlug(roaster.slug)
                setProfileDescription(roaster.description || '')
                setProfileModalOpen(true)
              }} 
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6FCF97'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              title="Editar Perfil / Datos"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar Usuario
            </button>
            <button 
              onClick={handleLogout} 
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.6rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B6B'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="scroll-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <a 
            href={`/${roaster.slug}`} 
            style={{ 
              fontSize: '0.6rem', 
              fontWeight: 600,
              color: 'var(--text-secondary)', 
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--green)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Ver Catálogo
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {!isPreviewMode && (
              <button onClick={() => setModalOpen(true)} style={{
                background: 'transparent', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-montserrat), sans-serif',
                border: 'none', 
                cursor: 'pointer',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '0.2rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--green)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Variedades
              </button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No tienes variedades registradas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map(p => {
              const validPrices = [p.price_250, p.price_340, p.price_500].filter(v => v > 0)
              const base = validPrices.length > 0 ? Math.min(...validPrices) : 0
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
              
              {/* Image Upload Box */}
              <div className="field" style={{ alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--glass)',
                  transition: 'var(--t)',
                }}
                onClick={() => document.getElementById('image-upload-input-add').click()}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📷</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>Cargar Imagen</span>
                      <span style={{ fontSize: '0.55rem', display: 'block', opacity: 0.6, marginTop: '0.2rem' }}>Recomendado: 200x200 px</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="image-upload-input-add" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setImageFile(file)
                        setImagePreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>

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
                <div className="field"><label>Precio 250g</label><input name="price250" type="text" inputMode="numeric" onChange={handlePriceInputChange} /></div>
                <div className="field"><label>Precio 340g</label><input name="price340" type="text" inputMode="numeric" onChange={handlePriceInputChange} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Precio 500g</label><input name="price500" type="text" inputMode="numeric" onChange={handlePriceInputChange} /></div>
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
              
              {/* Image Upload Box */}
              <div className="field" style={{ alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--glass)',
                  transition: 'var(--t)',
                }}
                onClick={() => document.getElementById('image-upload-input-edit').click()}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  {(editImagePreview || editingProduct.image_url) ? (
                    <>
                      <img src={editImagePreview || editingProduct.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditImagePreview(null);
                          setEditImageFile(null);
                          editingProduct.image_url = null;
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📷</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>Cargar Imagen</span>
                      <span style={{ fontSize: '0.55rem', display: 'block', opacity: 0.6, marginTop: '0.2rem' }}>Recomendado: 200x200 px</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="image-upload-input-edit" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setEditImageFile(file)
                        setEditImagePreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>

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
                  <input name="price250" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_250 ? editingProduct.price_250.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
                <div className="field">
                  <label>Precio 340g</label>
                  <input name="price340" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_340 ? editingProduct.price_340.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 500g</label>
                  <input name="price500" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_500 ? editingProduct.price_500.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
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
                <label>Logo del Cliente (Opcional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if(e.target.files && e.target.files[0]) {
                      setProfileLogoFile(e.target.files[0])
                    }
                  }} 
                />
                {(profileLogoFile || profileLogoUrl) && (
                  <img 
                    src={profileLogoFile ? URL.createObjectURL(profileLogoFile) : profileLogoUrl} 
                    alt="Logo preview" 
                    style={{ marginTop: '0.5rem', maxHeight: '50px', objectFit: 'contain', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px' }} 
                  />
                )}
              </div>

              <div className="field">
                <label>Descripción / Info de la Tostaduría</label>
                <textarea 
                  value={profileDescription} 
                  onChange={e => setProfileDescription(e.target.value)} 
                  placeholder="Ej: Café de especialidad de origen..."
                  rows={3}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--glass-border)', background: 'var(--bg)', color: 'var(--text-primary)', resize: 'vertical' }}
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
                  Su link cambiará a: becoffee.pro/<strong>{profileSlug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")}</strong>
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
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showProfilePassword ? "text" : "password"} 
                    value={profilePassword} 
                    onChange={e => setProfilePassword(e.target.value)} 
                    placeholder="Mínimo 6 caracteres"
                    style={{ paddingRight: '2.5rem', width: '100%' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowProfilePassword(!showProfilePassword)}
                    style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                    title={showProfilePassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showProfilePassword ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                </div>
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
