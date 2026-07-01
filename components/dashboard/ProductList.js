export default function ProductList({ products, handleStartEdit, handleDelete }) {
  const formatRoastDate = (dateStr) => {
    if (!dateStr) return ''
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (!match) return dateStr
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${match[3]} ${monthNames[parseInt(match[2], 10) - 1]} ${match[1]}`
  }

  if (products.length === 0) {
    return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No tienes variedades registradas.</p>
  }

  return (
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
  )
}
