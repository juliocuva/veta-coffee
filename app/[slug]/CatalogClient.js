'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const SIZE_CONFIG = {
  '250gr': { label: '250g',              kg: 0.25 },
  '340gr': { label: '340gr',             kg: 0.34 },
  '500gr': { label: '500g',              kg: 0.5  },
}

const formatRoastDate = (dateStr) => {
  if (!dateStr) return ''
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return dateStr
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${match[3]} ${monthNames[parseInt(match[2], 10) - 1]} ${match[1]}`
}

function mapRow(row) {
  return {
    id:            row.id,
    name:          row.name,
    lot:           row.lot,
    roastDate:     row.roast_date,
    variety:       row.variety,
    process:       row.process,
    region:        row.region,
    altitude:      row.altitude,
    notes:         row.notes,
    prices: { '250gr': row.price_250, '500gr': row.price_500, '340gr': row.price_340 },
    inventoryKg:   parseFloat(row.inventory_kg),
    isOffer:       row.is_offer,
    offerDiscount: parseFloat(row.offer_discount),
    imageUrl:      row.image_url,
  }
}

export default function CatalogPage({ roaster }) {
  const supabase = createClient()

  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [cart, setCart]                 = useState([])
  const [activeId, setActiveId]         = useState(null)
  const [panelOpen, setPanelOpen]       = useState(false)
  const [isDark, setIsDark]             = useState(false)
  const [user, setUser]                 = useState(null)

  // Check user authentication
  useEffect(() => {
    async function checkUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)
    }
    checkUser()
  }, [supabase])

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

  // Close panel on Escape keypress
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setPanelOpen(false)
        if (cart.length === 0) setActiveId(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [cart.length])


  // Load products
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('roaster_id', roaster.id)
        .order('created_at', { ascending: true })
      setProducts((data || []).map(mapRow))
      setLoading(false)
    }
    load()
  }, [roaster.id])

  const handleCardClick = useCallback((productId) => {
    setActiveId(productId)
    setPanelOpen(true)
  }, [])

  const handleQuantityChangeForWeightAndGrind = (wKey, grindOption, dir) => {
    const p = products.find(x => x.id === activeId)
    if (!p) return

    setCart(prev => {
      const cartItemsForProduct = prev.filter(item => item.productId === activeId)
      const currentCartWeight = cartItemsForProduct.reduce((sum, item) => sum + (SIZE_CONFIG[item.weight].kg * item.quantity), 0)
      const currentRemaining = Math.max(0, p.inventoryKg - currentCartWeight)

      if (dir > 0) {
        const itemWeight = SIZE_CONFIG[wKey].kg
        if (currentRemaining < itemWeight) {
          alert(`No hay suficiente stock disponible. Restante: ${currentRemaining.toFixed(2).replace(/\.00$/, '')} kg`)
          return prev
        }
      }

      const existing = prev.find(i => i.productId === activeId && i.weight === wKey && i.grind === grindOption)
      if (existing) {
        const nextQty = existing.quantity + dir
        if (nextQty <= 0) {
          const next = prev.filter(i => !(i.productId === activeId && i.weight === wKey && i.grind === grindOption))
          if (next.length === 0) {
            setPanelOpen(false)
            setActiveId(null)
          }
          return next
        }
        return prev.map(i => (i.productId === activeId && i.weight === wKey && i.grind === grindOption) ? { ...i, quantity: nextQty } : i)
      } else if (dir > 0) {
        return [...prev, { productId: activeId, weight: wKey, grind: grindOption, quantity: 1 }]
      }
      return prev
    })
  }

  const removeFromCart = (productId, weight, grind) => {
    setCart(prev => {
      const next = prev.filter(i => !(i.productId === productId && i.weight === weight && i.grind === grind))
      if (next.length === 0) {
        setPanelOpen(false)
        setActiveId(null)
      }
      return next
    })
  }

  const total = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.productId)
    if (!p || !item.weight) return sum
    let price = p.prices[item.weight]
    if (p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
    return sum + (price * item.quantity)
  }, 0)

  const buildWhatsAppMsg = () => {
    let msg = `*☕ NUEVO PEDIDO — ${roaster.name.toUpperCase()}*%0A%0A`
    cart.forEach((item, idx) => {
      const p = products.find(x => x.id === item.productId)
      if (!p || !item.weight) return
      let price = p.prices[item.weight]
      if (p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
      const sub = price * item.quantity
      msg += `*${idx + 1}. ${item.quantity}x ${p.variety}* (Caficultor: ${p.name})%0A`
      msg += `• ${SIZE_CONFIG[item.weight].label} · ${item.grind}%0A`
      msg += `• Valor unitario: $${price.toLocaleString()}%0A`
      msg += `• Subtotal: $${sub.toLocaleString()}%0A%0A`
    })
    msg += `*TOTAL: $${total.toLocaleString()}*%0A%0A_¡Hola! Quisiera hacer este pedido._`
    return `https://wa.me/${roaster.phone}?text=${msg}`
  }

  const handleOrderSubmit = async () => {
    const missingSize = cart.some(it => !it.weight)
    if (missingSize) {
      alert('Por favor selecciona el gramaje para cada café.')
      return
    }

    const insufficient = cart.some(it => {
      const p = products.find(x => x.id === it.productId)
      return p && it.weight && p.inventoryKg < (SIZE_CONFIG[it.weight].kg * it.quantity)
    })

    if (insufficient) {
      alert('Stock insuficiente para concretar el pedido de alguna de las variedades seleccionadas.')
      return
    }

    // Redirigir a WhatsApp
    const waUrl = buildWhatsAppMsg()
    window.open(waUrl, '_blank')

    // Descontar inventario en Supabase
    for (const item of cart) {
      const p = products.find(x => x.id === item.productId)
      if (!p || !item.weight) continue
      const kgToDeduct = SIZE_CONFIG[item.weight].kg * item.quantity
      const newKg = Math.max(0, p.inventoryKg - kgToDeduct)

      await supabase
        .from('products')
        .update({ inventory_kg: newKg })
        .eq('id', item.productId)
    }

    // Actualizar estado local del inventario
    setProducts(prev => prev.map(p => {
      const itemsForProduct = cart.filter(i => i.productId === p.id)
      if (itemsForProduct.length === 0) return p
      const totalDeduct = itemsForProduct.reduce((sum, item) => sum + (SIZE_CONFIG[item.weight].kg * item.quantity), 0)
      return {
        ...p,
        inventoryKg: Math.max(0, p.inventoryKg - totalDeduct)
      }
    }))

    // Resetear carrito localmente
    setCart([])
    setPanelOpen(false)
    setActiveId(null)
  }


  const panelVisible = cart.length > 0 || panelOpen
  const panelTranslate = !panelVisible ? '100%' : panelOpen ? '0%' : 'calc(100% - 68px)'

  return (
    <div className="app-shell">

      {/* Header */}
      <header style={{
        padding: '1.2rem 1.2rem 1.0rem',
        background: 'linear-gradient(180deg, #092617 0%, #0d311e 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {roaster.logo_url ? (
          <img 
            src={roaster.logo_url} 
            alt={roaster.name} 
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginBottom: '0.5rem', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
          />
        ) : (
          <h1 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ffffff', lineHeight: 1.2 }}>
            {roaster.name}
          </h1>
        )}
        {user ? (
          <a href="/admin/dashboard" style={{
            position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(110, 207, 151, 0.2)', border: '1px solid rgba(110, 207, 151, 0.4)',
            borderRadius: '16px',
            padding: '0.3rem 0.7rem',
            fontSize: '0.62rem',
            fontWeight: 700,
            color: '#6FCF97',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'var(--t)',
          }} title="Volver al panel de variedades">
            <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Volver</span>
          </a>
        ) : (
          <a href="/admin" style={{
            position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', textDecoration: 'none',
            transition: 'var(--t)',
          }} title="Acceso tostador">
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14H8v2H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </a>
        )}
        <button 
          onClick={toggleTheme} 
          style={{
            position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', cursor: 'pointer',
            transition: 'var(--t)',
          }}
          title="Cambiar tema"
        >
          {isDark ? (
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 010 1.414L13.293 6.7a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 9a1 1 0 000 2h1a1 1 0 100-2h-1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4-2.293a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 10a1 1 0 00-2 0v1a1 1 0 100 2h1a1 1 0 100-2H4zm.293-4.293a1 1 0 00-1.414 0L2.172 6.42a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </header>

      {/* Product list */}
      <main style={{
        flex: 1, overflowY: 'auto', padding: '1rem 0.9rem',
        paddingBottom: panelVisible ? '160px' : '1rem',
        transition: 'padding-bottom 0.3s',
      }}>
        {loading ? (
          <SkeletonCards />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          products.map((p, i) => {
            const cartItemsForProduct = cart.filter(c => c.productId === p.id)
            const cartWeight = cartItemsForProduct.reduce((sum, item) => sum + (SIZE_CONFIG[item.weight].kg * item.quantity), 0)
            const remainingStock = Math.max(0, p.inventoryKg - cartWeight)

            return (
              <ProductCard
                key={p.id}
                product={p}
                remainingStock={remainingStock}
                isInCart={cart.some(c => c.productId === p.id)}
                isDark={isDark}
                animDelay={i * 0.06 + 0.04}
                onClick={() => {
                  setActiveId(p.id)
                  setPanelOpen(true)
                }}
              />
            )
          })
        )}

        {!loading && products.length > 0 && (
          <footer style={{
            marginTop: '3rem',
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '2rem',
            paddingBottom: '1rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center',
            textAlign: 'center'
          }}>

            {/* Legal Notice */}
            <div style={{
              fontSize: '0.52rem',
              lineHeight: 1.5,
              maxWidth: 400,
              padding: '0 0.5rem',
              color: 'var(--text-muted)'
            }}>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.3rem 0' }}>
                Aviso de Propiedad Intelectual © 2026 Mouselab. Todos los derechos reservados.
              </p>
              <p style={{ margin: '0 0 0.3rem 0' }}>
                Mouselab es la entidad titular de todos los derechos de propiedad intelectual, secretos industriales y derechos de autor sobre la arquitectura de software, algoritmos de Inteligencia Artificial y diseños visuales presentados.
              </p>
              <p style={{ margin: 0 }}>
                AXISONE COFFEE es una marca comercial propiedad de Mouselab. El acceso a este material o enlaces no constituye una licencia de uso. Cualquier uso no autorizado será perseguido bajo las leyes de propiedad intelectual globales.
              </p>
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
              marginTop: '0.8rem',
              opacity: 0.8
            }}>
              <span>Powered by AxisONE Coffee</span>
              <img 
                src="/logo-axisone.png" 
                alt="AxisONE Coffee" 
                style={{ 
                  height: '14px', 
                  width: 'auto', 
                  objectFit: 'contain',
                  filter: isDark ? 'brightness(0) invert(1)' : 'brightness(0) opacity(0.5)'
                }} 
              />
            </div>
          </footer>
        )}
      </main>

      {/* Backdrop Overlay */}
      <div 
        onClick={() => {
          setPanelOpen(false)
          setActiveId(null)
        }}
        className={`panel-backdrop ${panelOpen ? 'active' : ''}`}
      />

      {/* Bottom sheet */}
      <section 
        className="drawer-bottom-sheet"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: activeId ? 'var(--bg-card)' : 'var(--panel-bg)',
          backdropFilter: activeId ? 'none' : 'blur(30px)',
          borderTop: activeId ? 'none' : '1px solid var(--glass-border)',
          borderTopLeftRadius: activeId ? 0 : 'var(--r-xl)',
          borderTopRightRadius: activeId ? 0 : 'var(--r-xl)',
          transform: `translateY(${panelTranslate})`,
          transition: 'transform 0.45s var(--smooth)',
          zIndex: 100,
          boxShadow: activeId ? 'none' : '0 -4px 40px var(--shadow-color)',
          height: activeId ? '100dvh' : 'auto',
          maxHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {activeId ? (() => {
          const activeProduct = products.find(p => p.id === activeId)
          if (!activeProduct) return null

          const cartItemsForProduct = cart.filter(c => c.productId === activeProduct.id)
          const cartWeight = cartItemsForProduct.reduce((sum, item) => sum + (SIZE_CONFIG[item.weight].kg * item.quantity), 0)
          const remainingStock = Math.max(0, activeProduct.inventoryKg - cartWeight)

          let isCustomImg = !!activeProduct.imageUrl
          let bagImg = activeProduct.imageUrl
          if (!bagImg) {
            bagImg = '/bag-lavado.png'
            const proc = (activeProduct.process || '').toLowerCase()
            if (proc.includes('honey')) bagImg = '/bag-honey.png'
            else if (proc.includes('natural')) bagImg = '/bag-natural.png'
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg)', minHeight: '100%' }}>
              {/* Header verde premium */}
              <div className="drawer-green-header" style={isCustomImg ? { height: '50vh', maxHeight: 'none', background: 'transparent', paddingBottom: 0 } : {}}>
                <img src={bagImg} className={isCustomImg ? "drawer-custom-image" : "drawer-bag-image"} alt="Coffee package" />
              </div>

              {/* Tarjeta de detalles blanca superpuesta */}
              <div className="drawer-details-card" style={isCustomImg ? { marginTop: 0, flex: 1 } : { flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h2 className="drawer-title">{activeProduct.variety}</h2>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="tag tag-region">{activeProduct.region}</span>
                      <span className="tag tag-default">{activeProduct.process}</span>
                      <span className="tag tag-default">{activeProduct.altitude}</span>
                      <span className="tag" style={{
                        background: remainingStock <= 2 ? 'rgba(219, 68, 85, 0.1)' : remainingStock <= 8 ? 'rgba(240, 173, 78, 0.1)' : 'rgba(0, 92, 56, 0.08)',
                        color: remainingStock <= 2 ? '#db4455' : remainingStock <= 8 ? '#f0ad4e' : 'var(--tag-region-text)',
                        borderColor: remainingStock <= 2 ? 'rgba(219, 68, 85, 0.2)' : remainingStock <= 8 ? 'rgba(240, 173, 78, 0.2)' : 'rgba(0, 92, 56, 0.15)',
                      }}>
                        {remainingStock <= 2 ? 'Agotado' : `${remainingStock.toFixed(2).replace(/\.00$/, '')} kg disponible`}
                      </span>
                      {activeProduct.roastDate && (
                        <span className="tag" style={{
                          background: 'rgba(158, 118, 63, 0.08)',
                          color: 'var(--gold)',
                          borderColor: 'rgba(158, 118, 63, 0.2)',
                        }}>
                          Tostado: {formatRoastDate(activeProduct.roastDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setPanelOpen(false)
                      setActiveId(null)
                    }}
                    style={{
                      background: 'var(--bg-card-2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      flexShrink: 0,
                      marginTop: '0.2rem',
                      transition: 'var(--t)'
                    }}
                    title="Volver al catálogo"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <p className="drawer-subtitle">
                  Caficultor: {activeProduct.name} {activeProduct.lot ? `· Finca: ${activeProduct.lot}` : ''}
                </p>
                {activeProduct.notes && (
                  <p className="drawer-notes">
                    Notas de cata: "{activeProduct.notes}"
                  </p>
                )}

                <hr className="drawer-divider" />

                {/* Opciones de compra */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '0.85rem' }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 600,
                    letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Configura tu pedido
                  </span>
                  
                  {Object.entries(SIZE_CONFIG).map(([wKey, cfg]) => {
                    let unitPrice = activeProduct.prices[wKey] || 0
                    if (unitPrice <= 0) return null
                    if (activeProduct.isOffer) unitPrice = Math.round(unitPrice * (1 - activeProduct.offerDiscount))

                    return (
                      <div key={wKey} style={{
                        background: isDark ? '#2E2D35' : '#FAF6EE',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(80, 37, 20, 0.12)'}`,
                        boxShadow: isDark ? 'none' : '0 2px 8px rgba(80, 37, 20, 0.03)',
                        borderRadius: 'var(--r-sm)', padding: '0.4rem 0.7rem',
                        display: 'flex', flexDirection: 'column', gap: '0.3rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>{cfg.label}</span>
                          <span style={{ fontSize: '0.88rem', color: 'var(--gold)', fontWeight: 800 }}>${unitPrice.toLocaleString()} c/u</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          {['Grano', 'Molido'].map(g => {
                            const cartItem = cart.find(i => i.productId === activeId && i.weight === wKey && i.grind === g)
                            const qty = cartItem ? cartItem.quantity : 0
                            const active = qty > 0

                            return (
                              <div key={g} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: active ? 'var(--gold-dim)' : 'rgba(0,0,0,0.02)',
                                border: `1px solid ${active ? 'var(--gold)' : 'var(--glass-border)'}`,
                                borderRadius: '8px', padding: '0.22rem 0.45rem', transition: 'var(--t)'
                              }}>
                                <span style={{ fontSize: '0.66rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                                  {g}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChangeForWeightAndGrind(wKey, g, -1)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    —
                                  </button>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 10, textAlign: 'center' }}>
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChangeForWeightAndGrind(wKey, g, 1)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Resumen del pedido si hay otros ítems */}
                {cart.length > 0 && (
                  <>
                    <hr className="drawer-divider" />
                    <span style={{ display: 'block', fontSize: '0.55rem', fontWeight: 600,
                      letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                      Resumen de tu pedido
                    </span>
                    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {cart.map(item => {
                        const cp = products.find(x => x.id === item.productId)
                        if (!cp) return null
                        let price = item.weight ? cp.prices[item.weight] : 0
                        if (item.weight && cp.isOffer) price = Math.round(price * (1 - cp.offerDiscount))
                        const subtotal = price * item.quantity
                        return (
                          <div 
                            key={item.productId + '-' + item.weight + '-' + item.grind}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              background: 'var(--glass)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: 'var(--r-sm)', padding: '0.55rem 0.8rem',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {cp.variety} <span style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 600 }}>(x{item.quantity})</span>
                              </div>
                              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                                {item.weight ? SIZE_CONFIG[item.weight].label : '⚠'} · {item.grind}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold)' }}>
                                ${subtotal.toLocaleString()}
                              </span>
                              <button onClick={() => removeFromCart(item.productId, item.weight, item.grind)} style={{
                                background: 'none', border: 'none', color: 'var(--text-muted)',
                                cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1,
                              }}>×</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                <hr className="drawer-divider" />

                {/* Fila de acción final */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total pedido</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      ${total.toLocaleString()}
                    </div>
                  </div>
                  <button onClick={handleOrderSubmit} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'linear-gradient(135deg, #25D366, #1EB858)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    padding: '0.85rem 1.4rem', borderRadius: 'var(--r-md)',
                    fontWeight: 700, fontSize: '0.76rem', letterSpacing: '0.04em',
                    textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
                    transition: 'var(--t)',
                  }}>
                    <WhatsAppIcon />
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )
        })() : (
          <>
            {/* Panel header / drag bar */}
            <div
              onClick={() => {
                if (cart.length > 0) {
                  setPanelOpen(o => !o)
                } else {
                  setPanelOpen(false)
                  setActiveId(null)
                }
              }}
              style={{
                height: 68, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 1.4rem',
                cursor: 'pointer', userSelect: 'none', position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                width: 36, height: 3, background: 'var(--glass-border)', borderRadius: 10 }} />
              <div>
                <div style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.14em',
                  color: 'var(--gold)', textTransform: 'uppercase' }}>Tu pedido</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ${total.toLocaleString()}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', transition: 'transform 0.3s',
                transform: panelOpen ? 'rotate(180deg)' : 'none' }}>▲</span>
            </div>

            {/* Panel body (default / cart summary view) */}
            <div style={{
              padding: '0 1.3rem 1.4rem',
              opacity: panelOpen ? 1 : 0,
              pointerEvents: panelOpen ? 'all' : 'none',
              transition: 'opacity 0.25s ease',
            }}>
              <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: '0.8rem',
                display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {cart.map(item => {
                  const p = products.find(x => x.id === item.productId)
                  if (!p) return null
                  let price = item.weight ? p.prices[item.weight] : 0
                  if (item.weight && p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
                  const subtotal = price * item.quantity
                  const active = item.productId === activeId
                  return (
                    <div 
                      key={item.productId + '-' + item.weight + '-' + item.grind}
                      onClick={() => setActiveId(item.productId)}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: active ? 'var(--gold-dim)' : 'var(--glass)',
                        border: `1px solid ${active ? 'var(--gold)' : 'var(--glass-border)'}`,
                        borderRadius: 'var(--r-sm)', padding: '0.55rem 0.8rem',
                        cursor: 'pointer', transition: 'var(--t)',
                        boxShadow: active ? '0 2px 8px var(--gold-glow)' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.variety} <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700 }}>(x{item.quantity})</span>
                        </div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                          {item.weight ? SIZE_CONFIG[item.weight].label : '⚠ Selecciona gramaje'} · {item.grind} · {p.name}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)' }}>
                          ${subtotal.toLocaleString()}
                        </span>
                        <button onClick={() => removeFromCart(item.productId, item.weight, item.grind)} style={{
                          background: 'none', border: 'none', color: 'var(--text-muted)',
                          cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
                        }}>×</button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '0.9rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                  <div style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em',
                    color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total final</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-primary)',
                    letterSpacing: '-0.02em', lineHeight: 1.1 }}>${total.toLocaleString()}</div>
                </div>
                <button onClick={handleOrderSubmit} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'linear-gradient(135deg, #25D366, #1EB858)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '0.85rem 1.2rem', borderRadius: 'var(--r-md)',
                  fontWeight: 700, fontSize: '0.74rem', letterSpacing: '0.04em',
                  textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
                  transition: 'var(--t)',
                }}>
                  <WhatsAppIcon />
                  Pedir
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

// — Sub-components —

function ProductCard({ product: p, remainingStock, isInCart, isDark, animDelay, onClick }) {
  const validPrices = Object.values(p.prices).filter(v => v > 0)
  const base = validPrices.length > 0 ? Math.min(...validPrices) : 0
  const displayPrice = p.isOffer ? Math.round(base * (1 - p.offerDiscount)) : base
  const stockClass = remainingStock <= 2 ? 'out' : remainingStock <= 8 ? 'low' : ''
  const stockLabel = remainingStock <= 2 
    ? 'AGOTADO' 
    : remainingStock <= 8 
      ? `SOLO ${remainingStock.toFixed(2).replace(/\.00$/, '')}KG` 
      : `${remainingStock.toFixed(2).replace(/\.00$/, '')}KG DISPONIBLE`

  const formatPrice = (val) => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Dynamic colors for differentiation based on process (unified to green-tinted Bourbon tone)
  let cardBg = 'var(--bg-card)'
  let cardBorder = 'var(--glass-border)'
  const cardShadow = isDark
    ? '0 4px 16px rgba(0, 0, 0, 0.35)'
    : '0 4px 14px rgba(80, 37, 20, 0.05)'
  
  if (!isInCart) {
    cardBg = isDark 
      ? 'linear-gradient(145deg, #1A2D23 0%, #111E17 100%)' 
      : 'linear-gradient(145deg, #F5FAF6 0%, #E5F1EB 100%)'
    cardBorder = isDark ? 'rgba(111, 207, 151, 0.25)' : 'rgba(0, 92, 56, 0.2)'
  } else {
    cardBg = 'linear-gradient(145deg, var(--bg-card) 0%, rgba(80,37,20,0.35) 100%)'
    cardBorder = 'var(--gold)'
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 'var(--r-lg)',
        padding: '0.8rem 1.0rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        transition: 'var(--t)',
        overflow: 'hidden',
        animation: `cardIn 0.4s var(--smooth) ${animDelay}s backwards`,
        boxShadow: isInCart ? '0 0 0 1px rgba(211,178,127,0.2), 0 8px 24px rgba(0,0,0,0.4)' : cardShadow,
      }}
    >
      {isInCart && (
        <div style={{
          position: 'absolute', top: '0.85rem', right: '0.85rem',
          background: 'var(--gold)', color: '#1F1E24',
          width: 26, height: 26, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 900,
          animation: 'popIn 0.35s var(--spring)',
          zIndex: 5,
        }}>✓</div>
      )}

      {/* Card Top: Variety */}
      <div style={{ marginBottom: '0.3rem', paddingRight: isInCart ? '2.5rem' : 0 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.01em', lineHeight: 1.3 }}>
          {p.variety}
        </h3>
      </div>

      {/* Row 2: Metadata tags (Region, Process) */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
        <span className="tag tag-region">
          {p.region}
        </span>
        <span className="tag tag-default">
          {p.process}
        </span>
        {p.isOffer && (
          <span className="tag tag-offer">
            −{Math.round(p.offerDiscount * 100)}% oferta
          </span>
        )}
      </div>

      {/* Divider and bottom section (always visible) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '0.6rem',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: stockClass === 'out' ? 'var(--danger)' : stockClass === 'low' ? 'var(--gold)' : 'var(--green)',
          }} />
          {stockLabel}
        </div>
        
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '0.2rem', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>desde</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {formatPrice(displayPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectBtn({ active, onClick, children }) {
  return (
    <div 
      onClick={onClick} 
      className={`select-btn-item ${active ? 'active' : ''}`}
      style={{
        background: active ? 'var(--btn-select-active-bg)' : 'var(--btn-select-bg)',
        border: `1px solid ${active ? 'var(--btn-select-active-border)' : 'var(--btn-select-border)'}`,
        color: active ? 'var(--btn-select-active-text)' : 'var(--btn-select-text)',
        padding: '0.6rem 0.4rem',
        borderRadius: 'var(--r-sm)',
        fontSize: '0.74rem',
        fontWeight: active ? 800 : 600,
        fontFamily: 'Montserrat, sans-serif',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'var(--t)',
        transform: active ? 'translateY(-1px)' : 'none',
        boxShadow: active ? '0 4px 14px var(--gold-glow)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'var(--btn-select-hover-bg)';
          e.currentTarget.style.color = 'var(--btn-select-hover-text)';
          e.currentTarget.style.borderColor = 'rgba(211,178,127,0.35)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'var(--btn-select-bg)';
          e.currentTarget.style.color = 'var(--btn-select-text)';
          e.currentTarget.style.borderColor = 'var(--btn-select-border)';
        }
      }}
    >
      {children}
    </div>
  )
}

function SkeletonCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
          borderRadius: 'var(--r-lg)', padding: '1.1rem',
          animation: 'pulseBadge 1.5s ease-in-out infinite',
        }}>
          <div style={{ height: '1rem', background: 'var(--glass)', borderRadius: 6, width: '60%', marginBottom: '0.7rem' }} />
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.6rem' }}>
            <div style={{ height: '0.8rem', background: 'var(--glass)', borderRadius: 4, width: 50 }} />
            <div style={{ height: '0.8rem', background: 'var(--glass)', borderRadius: 4, width: 40 }} />
          </div>
          <div style={{ height: '0.7rem', background: 'var(--glass)', borderRadius: 4, width: '80%' }} />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>☕</div>
      <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>No hay variedades disponibles</p>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
