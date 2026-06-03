'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const VARIETIES = ['Castillo', 'Caturra', 'Colombia', 'Bourbon', 'Tabi', 'Geisha', 'Bourbon Rosado', 'Pacamara', 'Typica', 'Sidra']
const PROCESSES = ['Lavado', 'Honey', 'Natural']

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

  const router = useRouter()
  const supabase = createClient()

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
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: fd.get('altitude') + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseInt(fd.get('price250')),
      price_500: parseInt(fd.get('price500')),
      price_2500: parseInt(fd.get('price2500')),
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
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: cleanAltitude + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseInt(fd.get('price250')),
      price_500: parseInt(fd.get('price500')),
      price_2500: parseInt(fd.get('price2500')),
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
              {copied ? '¡Copiado! ✅' : 'Copiar Link'}
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
              Editar
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
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--r-lg)', 
                  padding: '1.2rem', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Admin edit/delete buttons top right */}
                  <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', display: 'flex', gap: '0.4rem', zIndex: 10 }}>
                    <button onClick={() => handleStartEdit(p)} style={{
                      background: 'rgba(211,178,127,0.15)', border: '1px solid rgba(211,178,127,0.3)',
                      color: 'var(--gold)', width: 26, height: 26, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem'
                    }}>✏️</button>
                    <button onClick={() => handleDelete(p.id)} style={{
                      background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.3)',
                      color: '#E74C3C', width: 26, height: 26, borderRadius: '50%',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>×</button>
                  </div>

                  {/* Card Top: Variety and Grower/Lot Title Hierarchy */}
                  <div style={{ marginBottom: '0.6rem', paddingRight: '4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.01em', lineHeight: 1.3 }}>
                      {p.variety}
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.18rem' }}>
                      {p.name} {p.lot ? `· ${p.lot}` : ''}
                    </p>
                  </div>

                  {/* Row 2: Metadata tags (Region, Process, Altitude) */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
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
                    fontSize: '0.63rem', 
                    color: 'var(--text-muted)', 
                    fontStyle: 'italic', 
                    letterSpacing: '0.01em',
                    marginTop: '0.4rem',
                    marginBottom: '0.85rem'
                  }}>
                    {p.notes}
                  </p>

                  {/* Divider and bottom section */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--glass-border)',
                  }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.07em', color: 'var(--text-muted)' 
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: p.inventory_kg <= 2 ? 'var(--danger)' : p.inventory_kg <= 8 ? 'var(--gold)' : 'var(--green)',
                      }} />
                      {p.inventory_kg <= 2 ? 'AGOTADO' : p.inventory_kg <= 8 ? `SOLO ${p.inventory_kg}KG` : `${p.inventory_kg}KG DISPONIBLE`}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em',
                        color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Desde</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.02em' }}>
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
          position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)', padding: '1rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.6rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Nueva Variedad</h2>
              <button onClick={() => setModalOpen(false)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="field"><label>Caficultor</label><input name="name" required placeholder="Ej: Julio Cuva" /></div>
              <div className="field"><label>Finca/Lote</label><input name="lot" required placeholder="Ej: La Esperanza" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Variedad</label>
                  <select value={addVariety} onChange={e => setAddVariety(e.target.value)} required>
                    <option value="" disabled>Selecciona variedad</option>
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
                    <option value="" disabled>Selecciona proceso</option>
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
                <div className="field"><label>Precio 250g</label><input name="price250" type="number" required /></div>
                <div className="field"><label>Precio 500g</label><input name="price500" type="number" required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Precio 2.5kg</label><input name="price2500" type="number" required /></div>
                <div className="field"><label>Cantidad Disponible (kg)</label><input name="inventoryKg" type="number" step="0.1" required placeholder="Ej: 25" /></div>
              </div>
              <div className="field"><label>Notas de cata</label><input name="notes" placeholder="Durazno, Panela..." /></div>
              
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
          position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)', padding: '1rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.6rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Variedad</h2>
              <button onClick={() => setEditingProduct(null)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="field">
                <label>Caficultor</label>
                <input name="name" required defaultValue={editingProduct.name} />
              </div>
              <div className="field">
                <label>Finca/Lote</label>
                <input name="lot" required defaultValue={editingProduct.lot} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Variedad</label>
                  <select value={editVariety} onChange={e => setEditVariety(e.target.value)} required>
                    <option value="" disabled>Selecciona variedad</option>
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
                    <option value="" disabled>Selecciona proceso</option>
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
                  <input name="price250" type="number" required defaultValue={editingProduct.price_250} />
                </div>
                <div className="field">
                  <label>Precio 500g</label>
                  <input name="price500" type="number" required defaultValue={editingProduct.price_500} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 2.5kg</label>
                  <input name="price2500" type="number" required defaultValue={editingProduct.price_2500} />
                </div>
                <div className="field">
                  <label>Cantidad Disponible (kg)</label>
                  <input name="inventoryKg" type="number" step="0.1" required defaultValue={editingProduct.inventory_kg} />
                </div>
              </div>
              <div className="field">
                <label>Notas de cata</label>
                <input name="notes" defaultValue={editingProduct.notes} />
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
          position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)', padding: '1rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.6rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Registro</h2>
              <button onClick={() => setProfileModalOpen(false)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
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
