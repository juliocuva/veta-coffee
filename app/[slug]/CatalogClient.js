'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const SIZE_CONFIG = {
  '250gr': { label: '250g',              kg: 0.25 },
  '500gr': { label: '500g',              kg: 0.5  },
  '2.5kg': { label: 'Cuarterón (2.5kg)', kg: 2.5  },
}

function mapRow(row) {
  return {
    id:            row.id,
    name:          row.name,
    lot:           row.lot,
    variety:       row.variety,
    process:       row.process,
    region:        row.region,
    altitude:      row.altitude,
    notes:         row.notes,
    prices: { '250gr': row.price_250, '500gr': row.price_500, '2.5kg': row.price_2500 },
    inventoryKg:   parseFloat(row.inventory_kg),
    isOffer:       row.is_offer,
    offerDiscount: parseFloat(row.offer_discount),
  }
}

export default function CatalogPage({ roaster }) {
  const supabase = createClient()

  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [cart, setCart]                 = useState([])
  const [activeId, setActiveId]         = useState(null)
  const [panelOpen, setPanelOpen]       = useState(false)
  const [selectedWeight, setWeight]     = useState(null)
  const [selectedGrind, setGrind]       = useState('Grano')

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

  // Sync panel controls when active item changes
  useEffect(() => {
    if (!activeId) return
    const item = cart.find(i => i.productId === activeId)
    if (item) {
      setWeight(item.weight)
      setGrind(item.grind)
    }
  }, [activeId])

  const handleCardClick = useCallback((productId) => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === productId)
      if (exists) return prev
      return [...prev, { productId, weight: null, grind: 'Grano' }]
    })
    setActiveId(productId)
    setPanelOpen(true)
  }, [])

  const handleWeightChange = (w) => {
    setWeight(w)
    setCart(prev => prev.map(i => i.productId === activeId ? { ...i, weight: w } : i))
  }

  const handleGrindChange = (g) => {
    setGrind(g)
    setCart(prev => prev.map(i => i.productId === activeId ? { ...i, grind: g } : i))
  }

  const removeFromCart = (productId) => {
    setCart(prev => {
      const next = prev.filter(i => i.productId !== productId)
      if (activeId === productId) setActiveId(next.length ? next[next.length - 1].productId : null)
      if (next.length === 0) setPanelOpen(false)
      return next
    })
  }

  const total = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.productId)
    if (!p || !item.weight) return sum
    let price = p.prices[item.weight]
    if (p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
    return sum + price
  }, 0)

  const buildWhatsAppMsg = () => {
    let msg = `*☕ NUEVO PEDIDO — ${roaster.name.toUpperCase()}*%0A%0A`
    cart.forEach((item, idx) => {
      const p = products.find(x => x.id === item.productId)
      if (!p || !item.weight) return
      let price = p.prices[item.weight]
      if (p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
      msg += `*${idx + 1}. ${p.variety}* (Caficultor: ${p.name})%0A`
      msg += `• ${SIZE_CONFIG[item.weight].label} · ${item.grind}%0A`
      msg += `• $${price.toLocaleString()}%0A%0A`
    })
    msg += `*TOTAL: $${total.toLocaleString()}*%0A%0A_¡Hola! Quisiera hacer este pedido._`
    return `https://wa.me/${roaster.phone}?text=${msg}`
  }

  const panelVisible = cart.length > 0
  const panelTranslate = !panelVisible ? '100%' : panelOpen ? '0%' : 'calc(100% - 68px)'

  return (
    <div className="app-shell">

      {/* Header */}
      <header style={{
        padding: '1.1rem 1.2rem 0.9rem',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--glass-border)',
        textAlign: 'center',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img src="/logo.png" alt="Logo" style={{ width: 38, height: 38, objectFit: 'contain', filter: 'invert(1) brightness(1.8)', marginBottom: '0.4rem' }} />
        <h1 style={{ fontFamily: 'var(--font-museomoderno), sans-serif', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold)', lineHeight: 1.2 }}>
          {roaster.name}
        </h1>
        <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.25rem', letterSpacing: '0.04em' }}>
          Café de especialidad · Pedido directo
        </p>
        <a href="/admin" style={{
          position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--glass)', border: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem',
          transition: 'var(--t)',
        }} title="Acceso tostador">🔑</a>
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
          products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              isInCart={cart.some(c => c.productId === p.id)}
              animDelay={i * 0.06 + 0.04}
              onClick={() => handleCardClick(p.id)}
            />
          ))
        )}
      </main>

      {/* Bottom sheet */}
      <section style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(27, 26, 32, 0.9)',
        backdropFilter: 'blur(30px)',
        borderTop: '1px solid var(--glass-border)',
        borderTopLeftRadius: 'var(--r-xl)',
        borderTopRightRadius: 'var(--r-xl)',
        transform: `translateY(${panelTranslate})`,
        transition: 'transform 0.45s var(--smooth)',
        zIndex: 100,
        boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
      }}>
        {/* Panel header / drag bar */}
        <div
          onClick={() => cart.length > 0 && setPanelOpen(o => !o)}
          style={{
            height: 68, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 1.4rem',
            cursor: 'pointer', userSelect: 'none', position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            width: 36, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 10 }} />
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

        {/* Panel body */}
        <div style={{
          padding: '0 1.3rem 1.4rem',
          opacity: panelOpen ? 1 : 0,
          pointerEvents: panelOpen ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}>
          {/* Grind */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ display: 'block', fontSize: '0.52rem', fontWeight: 700,
              letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase',
              marginBottom: '0.55rem' }}>Presentación</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
              {['Grano', 'Molido'].map(g => (
                <SelectBtn key={g} active={selectedGrind === g} onClick={() => handleGrindChange(g)}>
                  {g === 'Grano' ? '☕' : '⚙️'} {g}
                </SelectBtn>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div style={{ marginBottom: '0.8rem' }}>
            <span style={{ display: 'block', fontSize: '0.52rem', fontWeight: 700,
              letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase',
              marginBottom: '0.55rem' }}>Gramaje</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
              {Object.entries(SIZE_CONFIG).map(([key, cfg]) => (
                <SelectBtn key={key} active={selectedWeight === key} onClick={() => handleWeightChange(key)}>
                  {cfg.label}
                </SelectBtn>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div style={{ maxHeight: 120, overflowY: 'auto', marginBottom: '0.8rem',
            display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {cart.map(item => {
              const p = products.find(x => x.id === item.productId)
              if (!p) return null
              let price = item.weight ? p.prices[item.weight] : 0
              if (item.weight && p.isOffer) price = Math.round(price * (1 - p.offerDiscount))
              return (
                <div key={item.productId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--glass)', border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--r-sm)', padding: '0.55rem 0.8rem',
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.variety}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                      {item.weight ? SIZE_CONFIG[item.weight].label : '⚠ Selecciona gramaje'} · {item.grind}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)' }}>
                      ${price.toLocaleString()}
                    </span>
                    <button onClick={() => removeFromCart(item.productId)} style={{
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
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
            <a href={buildWhatsAppMsg()} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #25D366, #1EB858)',
              color: '#fff', textDecoration: 'none',
              padding: '0.85rem 1.2rem', borderRadius: 'var(--r-md)',
              fontWeight: 700, fontSize: '0.74rem', letterSpacing: '0.04em',
              textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
              transition: 'var(--t)',
            }}>
              <WhatsAppIcon />
              Pedir
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// — Sub-components —

function ProductCard({ product: p, isInCart, animDelay, onClick }) {
  const base = p.prices['250gr']
  const displayPrice = p.isOffer ? Math.round(base * (1 - p.offerDiscount)) : base
  const stockClass = p.inventoryKg <= 2 ? 'out' : p.inventoryKg <= 8 ? 'low' : ''
  const stockLabel = p.inventoryKg <= 2 
    ? 'AGOTADO' 
    : p.inventoryKg <= 8 
      ? `SOLO ${p.inventoryKg}KG` 
      : `${p.inventoryKg}KG DISPONIBLE`

  const formatPrice = (val) => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: isInCart
          ? 'linear-gradient(145deg, var(--bg-card) 0%, rgba(80,37,20,0.35) 100%)'
          : 'var(--bg-card)',
        border: `1px solid ${isInCart ? 'var(--gold)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--r-lg)',
        padding: '1.2rem',
        marginBottom: '0.8rem',
        cursor: 'pointer',
        transition: 'var(--t)',
        overflow: 'hidden',
        animation: `cardIn 0.4s var(--smooth) ${animDelay}s backwards`,
        boxShadow: isInCart ? '0 0 0 1px rgba(211,178,127,0.2), 0 8px 24px rgba(0,0,0,0.4)' : 'none',
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
        }}>✓</div>
      )}

      {/* Row 1: Region & Variety */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem', paddingRight: isInCart ? '2.5rem' : 0 }}>
        <span className="tag tag-region" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem' }}>
          {(p.region || '').toUpperCase()}
        </span>
        <span className="tag tag-default" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem', color: '#E8D5C4', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          👨‍🌾 {(p.variety || '').toUpperCase()}
        </span>
      </div>

      {/* Row 2: Lot, Process, Altitude */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <span className="tag tag-default" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem', color: '#E8D5C4' }}>
          🏡 LOTE: {(p.lot || '').toUpperCase()}
        </span>
        <span className="tag tag-default" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem', color: '#E8D5C4' }}>
          {(p.process || '').toUpperCase()}
        </span>
        <span className="tag tag-default" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem', color: '#E8D5C4' }}>
          {(p.altitude || '').toUpperCase()}
        </span>
      </div>

      {/* Row 3: Offer (if any) */}
      {p.isOffer && (
        <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
          <span className="tag tag-offer" style={{ fontSize: '0.58rem', fontWeight: 800, padding: '0.25rem 0.6rem', letterSpacing: '0.04em' }}>
            −{Math.round(p.offerDiscount * 100)}% OFERTA
          </span>
        </div>
      )}

      {/* Tasting notes */}
      <p style={{ 
        fontSize: '0.66rem', 
        color: 'var(--text-muted)', 
        fontStyle: 'italic', 
        letterSpacing: '0.02em',
        marginTop: '0.65rem',
        marginBottom: '0.95rem'
      }}>
        {p.notes}
      </p>

      {/* Divider and bottom section */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '0.85rem',
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
}

function SelectBtn({ active, onClick, children }) {
  return (
    <div onClick={onClick} style={{
      background: active ? 'linear-gradient(135deg, var(--gold), #C09A5A)' : 'var(--glass)',
      border: `1px solid ${active ? 'var(--gold)' : 'var(--glass-border)'}`,
      color: active ? '#1F1E24' : 'rgba(255,255,255,0.4)',
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
    }}>{children}</div>
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
