'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardClient({ initialRoaster, initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isOffer, setIsOffer] = useState(false)
  
  // Edit states
  const [editingProduct, setEditingProduct] = useState(null)
  const [editIsOffer, setEditIsOffer] = useState(false)

  const [copied, setCopied] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (initialRoaster?.slug) {
      localStorage.setItem('veta_saved_slug', initialRoaster.slug)
    }
  }, [initialRoaster])

  const handleCopyLink = () => {
    const origin = window.location.origin
    const storeUrl = `${origin}/${initialRoaster.slug}`
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
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData(e.target)
    const newProduct = {
      roaster_id: initialRoaster.id,
      name: fd.get('name'),
      lot: fd.get('lot'),
      variety: fd.get('variety'),
      process: fd.get('process'),
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
    }
    setSaving(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const fd = new FormData(e.target)
    
    // Extract numbers safely
    const cleanAltitude = fd.get('altitude').replace(' msnm', '')

    const updatedProduct = {
      name: fd.get('name'),
      lot: fd.get('lot'),
      variety: fd.get('variety'),
      process: fd.get('process'),
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
        padding: '1rem 1.2rem', background: 'var(--green-dim)',
        borderBottom: '1px solid rgba(0,97,60,0.25)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-museomoderno), sans-serif', fontSize: '0.9rem', fontWeight: 800, color: '#6FCF97', letterSpacing: '0.04em' }}>
            Panel de {initialRoaster.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
            <a href={`/${initialRoaster.slug}`} target="_blank" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              Ver catálogo ↗
            </a>
            <button 
              onClick={handleCopyLink} 
              style={{
                background: 'rgba(211,178,127,0.12)',
                border: '1px solid rgba(211,178,127,0.3)',
                borderRadius: 6,
                padding: '0.2rem 0.5rem',
                fontSize: '0.55rem',
                fontWeight: 700,
                color: 'var(--gold)',
                cursor: 'pointer',
                transition: 'var(--t)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {copied ? '¡Copiado! ✅' : '🔗 Copiar Link WhatsApp'}
            </button>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none', border: '1px solid rgba(0,97,60,0.4)', borderRadius: 6,
          fontSize: '0.6rem', fontWeight: 700, color: '#6FCF97', padding: '0.25rem 0.6rem',
          cursor: 'pointer', textTransform: 'uppercase'
        }}>Salir</button>
      </header>

      {/* Content */}
      <main className="scroll-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-museomoderno), sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>Mis Variedades</h2>
          <button onClick={() => setModalOpen(true)} style={{
            background: 'var(--green)', color: '#fff', border: 'none', width: 32, height: 32,
            borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>+</button>
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No tienes variedades registradas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map(p => (
              <div key={p.id} style={{
                background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-lg)', padding: '1.1rem', position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', display: 'flex', gap: '0.4rem' }}>
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
                <h3 style={{ fontSize: '1rem', fontWeight: 700, paddingRight: '3.5rem' }}>{p.variety}</h3>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Caficultor: {p.name} · Lote: {p.lot} · {p.process}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700 }}>
                  ${p.price_250.toLocaleString()} <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 250g</span>
                </div>
              </div>
            ))}
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
              <h2 style={{ fontFamily: 'var(--font-museomoderno), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Nueva Variedad</h2>
              <button onClick={() => setModalOpen(false)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div className="field"><label>Caficultor</label><input name="name" required placeholder="Ej: Julio Cuva" /></div>
              <div className="field"><label>Finca/Lote</label><input name="lot" required placeholder="Ej: La Esperanza" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field"><label>Variedad</label><input name="variety" required /></div>
                <div className="field"><label>Proceso</label><input name="process" required /></div>
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
              <h2 style={{ fontFamily: 'var(--font-museomoderno), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Variedad</h2>
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
                  <input name="variety" required defaultValue={editingProduct.variety} />
                </div>
                <div className="field">
                  <label>Proceso</label>
                  <input name="process" required defaultValue={editingProduct.process} />
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
    </div>
  )
}
